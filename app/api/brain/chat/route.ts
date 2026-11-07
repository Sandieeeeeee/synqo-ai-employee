import { NextRequest } from "next/server";

const MODELS: Record<string,string> = {
  "synqo-default": process.env.AI_GATEWAY_MODEL || "minimax/minimax-m3-free",
};
type Message = { role: "user" | "assistant"; content: string };

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
    const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!token || !key) return Response.json({error:"Sign in required."},{status:401});
    const check = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key="+encodeURIComponent(key),{
      method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({idToken:token}),cache:"no-store"
    });
    if (!check.ok) return Response.json({error:"Invalid session."},{status:401});
    const account = await check.json() as {users?:Array<{localId?:string,emailVerified?:boolean}>};
    if (!account.users?.[0]?.localId || !account.users[0].emailVerified) return Response.json({error:"Verify your email first."},{status:403});
    const body = await request.json() as {model?:string;messages?:Message[]};
    const model = MODELS[body.model || "synqo-default"];
    if (!model || !Array.isArray(body.messages) || body.messages.length<1 || body.messages.length>12 ||
      body.messages.some(m=>!m || !["user","assistant"].includes(m.role) || typeof m.content!=="string" || m.content.length<1 || m.content.length>3000) ||
      body.messages.at(-1)?.role!=="user") return Response.json({error:"Invalid chat request."},{status:400});
    const credential=process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
    if (!credential) return Response.json({error:"AI provider is not configured."},{status:503});
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),30000);
    try {
      const result=await fetch("https://ai-gateway.vercel.sh/v1/chat/completions",{
        method:"POST",headers:{"authorization":"Bearer "+credential,"content-type":"application/json","x-title":"Synqo Brain"},
        body:JSON.stringify({model,messages:[{role:"system",content:"You are Synqo Brain, a helpful AI assistant. Be accurate, transparent about uncertainty, and match the user's language. Do not claim access to tools or data that are not available."},...body.messages],max_completion_tokens:850}),
        signal:controller.signal,cache:"no-store"
      });
      if (!result.ok) return Response.json({error:result.status===429?"AI is busy. Try again shortly.":"AI provider request failed."},{status:result.status===429?429:502});
      const data=await result.json() as {choices?:Array<{message?:{content?:string}}>};
      const answer=data.choices?.[0]?.message?.content?.trim();
      if (!answer) return Response.json({error:"Empty response from AI."},{status:502});
      return Response.json({answer,model:"synqo-default"});
    } finally {clearTimeout(timeout);}
  } catch(e) {return Response.json({error:e instanceof Error && e.name==="AbortError"?"Request timed out.":"Unable to process chat."},{status:500});}
}

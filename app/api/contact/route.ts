import { NextResponse } from "next/server";
import { Resend } from "resend";
export const runtime = "nodejs";

type FormData = { name?:string; email?:string; company?:string; businessType?:string; teamSize?:string; priority?:string; message?:string; website?:string };
const esc=(v:string)=>v.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
const validEmail=(v:string)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export async function POST(request:Request){
  try{
    const apiKey=process.env.RESEND_API_KEY, contactEmail=process.env.CONTACT_EMAIL;
    if(!apiKey||!contactEmail) return NextResponse.json({success:false,message:"Email service is not configured."},{status:500});
    const body=(await request.json()) as FormData;
    const name=body.name?.trim()??"", email=body.email?.trim().toLowerCase()??"", company=body.company?.trim()??"", businessType=body.businessType?.trim()??"", teamSize=body.teamSize?.trim()??"", priority=body.priority?.trim()??"", message=body.message?.trim()??"", website=body.website?.trim()??"";
    if(website) return NextResponse.json({success:true,message:"Request received."});
    if(!name||!email||!company||!businessType||!teamSize||!priority||!message) return NextResponse.json({success:false,message:"Please complete all required fields."},{status:400});
    if(!validEmail(email)) return NextResponse.json({success:false,message:"Please enter a valid email address."},{status:400});
    if(message.length>5000) return NextResponse.json({success:false,message:"Message is too long."},{status:400});
    const resend=new Resend(apiKey);
    const {error}=await resend.emails.send({from:"Synqo AI Website <onboarding@resend.dev>",to:[contactEmail],replyTo:email,subject:`New Synqo AI Employee Early Access Request - ${company}`,
      text:["NEW SYNQO AI EMPLOYEE EARLY ACCESS REQUEST","",`Name: ${name}`,`Business Email: ${email}`,`Business Name: ${company}`,`Business Type: ${businessType}`,`Team Size: ${teamSize}`,`Main Priority: ${priority}`,"","What they want their AI Employee to handle:",message].join("\n"),
      html:`<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;padding:30px;background:#f7f9fc"><h2>New Synqo AI Employee Early Access Request</h2><p><strong>Name:</strong><br>${esc(name)}</p><p><strong>Business Email:</strong><br>${esc(email)}</p><p><strong>Business Name:</strong><br>${esc(company)}</p><p><strong>Business Type:</strong><br>${esc(businessType)}</p><p><strong>Team Size:</strong><br>${esc(teamSize)}</p><p><strong>Main Priority:</strong><br>${esc(priority)}</p><p><strong>AI Employee workflow:</strong></p><div style="padding:16px;background:white;border:1px solid #e5e7eb;border-radius:10px">${esc(message).replaceAll("\n","<br>")}</div></div>`});
    if(error){console.error("Resend error:",error); return NextResponse.json({success:false,message:"Email could not be sent. Please try again."},{status:500});}
    return NextResponse.json({success:true,message:"Early access request submitted successfully."});
  }catch(error){console.error("Early access form error:",error); return NextResponse.json({success:false,message:"Unable to submit your request right now."},{status:500});}
}

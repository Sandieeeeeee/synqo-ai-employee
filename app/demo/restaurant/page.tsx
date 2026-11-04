import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock3, MapPin, Phone, Star, Utensils, Leaf, Coffee, ChefHat } from "lucide-react";

export const metadata: Metadata = {title:"Restaurant Website Demo | Synqo AI Studio",description:"Interactive sample restaurant landing page created as a portfolio demonstration by Synqo AI Studio.",robots:{index:false,follow:true}};
const menu=[{name:"Garden Pesto Pasta",description:"Basil pesto, cherry tomatoes, parmesan",price:"$19",icon:"🍝"},{name:"Wood-Fired Margherita",description:"Fresh mozzarella, basil, tomato",price:"$17",icon:"🍕"},{name:"Harvest Bowl",description:"Quinoa, roasted vegetables, tahini",price:"$18",icon:"🥗"},{name:"Signature Cappuccino",description:"Double espresso, silky steamed milk",price:"$5",icon:"☕"}];
export default function RestaurantDemo(){
return <main style={{background:"#111a16",color:"#f7f3e9",fontFamily:"Arial, sans-serif",minHeight:"100vh"}}>
<div style={{background:"#d9ad73",color:"#18251e",padding:"10px 5%",textAlign:"center",fontSize:12,fontWeight:700,letterSpacing:1}}>SYNQO AI STUDIO — DEMONSTRATION PROJECT • FICTIONAL RESTAURANT</div>
<header style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,flexWrap:"wrap",padding:"22px 6%",borderBottom:"1px solid #ffffff22"}}>
<Link href="/portfolio" style={{fontSize:13,color:"#d9ad73",display:"flex",gap:6,alignItems:"center"}}><ArrowLeft size={16}/> Synqo Portfolio</Link>
<a href="#top" style={{fontSize:24,fontFamily:"Georgia,serif",fontWeight:700}}>OLIVE & EMBER</a>
<nav style={{display:"flex",gap:18,fontSize:13}}><a href="#menu">Menu</a><a href="#story">Our Story</a><a href="#visit">Visit</a></nav>
</header>
<section id="top" style={{padding:"100px 6% 110px",background:"radial-gradient(circle at 78% 50%,#566c4d 0%,#26382d 32%,#111a16 72%)",display:"grid",gap:26}}>
<div style={{color:"#e0b77b",letterSpacing:3,fontSize:12}}>FRESH • SEASONAL • MADE WITH CARE</div>
<h1 style={{fontFamily:"Georgia,serif",fontSize:"clamp(52px,9vw,112px)",lineHeight:1.02,maxWidth:860,letterSpacing:-3}}>Good food.<br/><em style={{color:"#e0b77b"}}>Great company.</em></h1>
<p style={{fontSize:18,lineHeight:1.8,color:"#d1d7cc",maxWidth:540}}>A warm neighbourhood dining concept celebrating fresh ingredients, thoughtful cooking, and moments worth sharing.</p>
<div style={{display:"flex",gap:12,flexWrap:"wrap"}}><a href="#menu" style={{padding:"15px 24px",borderRadius:6,background:"#e0b77b",color:"#17251c",fontWeight:700}}>Explore Our Menu</a><a href="#visit" style={{padding:"15px 24px",border:"1px solid #b3bba9",borderRadius:6}}>Plan Your Visit</a></div>
<div style={{display:"flex",gap:25,flexWrap:"wrap",color:"#d5c8ad",fontSize:13,marginTop:30}}><span style={{display:"flex",alignItems:"center",gap:8}}><Leaf size={16}/> Seasonal Ingredients</span><span style={{display:"flex",alignItems:"center",gap:8}}><ChefHat size={16}/> Thoughtful Cooking</span><span style={{display:"flex",alignItems:"center",gap:8}}><Coffee size={16}/> Cozy Atmosphere</span></div>
</section>
<section id="menu" style={{padding:"90px 6%",background:"#f5f0e5",color:"#1d2c22"}}>
<div style={{textAlign:"center",marginBottom:42}}><span style={{color:"#8b6945",fontSize:12,letterSpacing:3}}>MADE WITH LOVE</span><h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(38px,6vw,64px)",marginTop:12}}>A taste of the good life.</h2><p style={{color:"#647066",marginTop:12}}>A sample menu for this fictional restaurant concept.</p></div>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:20,maxWidth:1200,margin:"auto"}}>{menu.map(item=><article key={item.name} style={{background:"#fff",padding:28,borderRadius:12,boxShadow:"0 12px 35px #182b1610"}}><div style={{fontSize:58,marginBottom:22}}>{item.icon}</div><div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"start"}}><h3 style={{fontFamily:"Georgia,serif",fontSize:22}}>{item.name}</h3><strong style={{color:"#8b6945"}}>{item.price}</strong></div><p style={{color:"#6d796e",fontSize:14,lineHeight:1.7,marginTop:12}}>{item.description}</p></article>)}</div>
</section>
<section id="story" style={{padding:"100px 6%",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:50,alignItems:"center"}}>
<div style={{fontSize:130,textAlign:"center",background:"linear-gradient(135deg,#314a39,#1b2a20)",borderRadius:20,padding:50}}>🌿</div>
<div><span style={{color:"#e0b77b",letterSpacing:3,fontSize:12}}>OUR STORY</span><h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(40px,5vw,66px)",margin:"20px 0"}}>Gather around the table.</h2><p style={{color:"#c6d1c7",fontSize:17,lineHeight:1.9}}>Olive & Ember is a fictional restaurant brand created to demonstrate how a modern hospitality website can communicate its atmosphere, highlight signature dishes and guide guests toward a visit.</p></div>
</section>
<section id="visit" style={{padding:"90px 6%",background:"#23352a",textAlign:"center"}}>
<span style={{color:"#e0b77b",letterSpacing:3,fontSize:12}}>COME AS YOU ARE</span><h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(40px,6vw,70px)",margin:"20px 0"}}>Your table awaits.</h2><p style={{color:"#c5d1c5",lineHeight:1.8,maxWidth:590,margin:"0 auto 32px"}}>This is a portfolio demonstration, not a real restaurant. The booking and contact details are intentionally not connected to a business.</p>
<div style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:22,fontSize:14,color:"#e8dfcd"}}><span style={{display:"flex",gap:7,alignItems:"center"}}><MapPin size={17}/> Sample location only</span><span style={{display:"flex",gap:7,alignItems:"center"}}><Clock3 size={17}/> Sample hours only</span></div>
<Link href="/contact" style={{display:"inline-flex",alignItems:"center",gap:10,marginTop:36,padding:"16px 24px",background:"#e0b77b",color:"#17251c",fontWeight:700,borderRadius:6}}>Build a Website Like This <ArrowRight size={17}/></Link>
</section>
<footer style={{padding:"28px 6%",display:"flex",justifyContent:"space-between",gap:15,flexWrap:"wrap",fontSize:12,color:"#c4c9bc"}}><span>OLIVE & EMBER — Concept website by Synqo AI Studio</span><Link href="/portfolio">Back to Portfolio</Link></footer>
</main>;
}
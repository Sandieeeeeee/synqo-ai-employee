import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Bot, Building2, CalendarDays, Globe2, MessageSquare, Sparkles, UtensilsCrossed } from "lucide-react";
import InteractiveBackground from "@/components/InteractiveBackground";

export const metadata: Metadata = {
  title: "Portfolio & Demo Projects",
  description: "Explore Synqo AI Studio's concept websites, business automation prototypes and AI assistant demonstrations. Clearly labelled sample projects.",
  alternates: { canonical: "/portfolio" },
};

const projects = [
  { number:"01", icon:UtensilsCrossed, category:"Website concept", title:"Restaurant & Café Website", description:"A sample restaurant experience featuring a menu, photo gallery, location details and reservation enquiry flow.", features:["Responsive design","Menu & gallery","Reservation enquiry"], status:"Live interactive demo", href:"/demo/restaurant" },
  { number:"02", icon:Building2, category:"Website concept", title:"Real Estate Website", description:"A property showcase concept with listing cards, agent information and a buyer enquiry journey.", features:["Property listings","Agent profile","Lead enquiry"], status:"Live interactive demo", href:"/demo/real-estate" },
  { number:"03", icon:CalendarDays, category:"Website concept", title:"Salon & Barber Booking", description:"A modern service-business concept for showcasing treatments, prices and booking requests.", features:["Service catalogue","Pricing","Booking enquiry"], status:"Live interactive demo", href:"/demo/salon" },
  { number:"04", icon:Bot, category:"AI prototype", title:"Customer Support Assistant", description:"An illustrative assistant workflow for frequently asked questions, customer enquiries and lead capture.", features:["FAQ workflow","Lead capture","Human handoff concept"], status:"Live interactive demo", href:"/demo/assistant" },
];

export default function PortfolioPage() {
  return (
    <main className="products-page">
      <InteractiveBackground />
      <nav className="inner-navbar">
        <Link href="/" className="brand"><span className="brand-mark">S</span><span className="brand-text">SYNQO <strong>AI</strong></span></Link>
        <Link href="/services" className="inner-back-link"><ArrowLeft size={16}/> Services</Link>
      </nav>
      <section className="products-page-hero">
        <div className="products-page-heading">
          <span className="section-label">SYNQO AI STUDIO / PORTFOLIO</span>
          <h1>Ideas built for <br/><span>real business needs.</span></h1>
          <p>Explore the kinds of websites and intelligent workflows we can design for growing businesses. These are fictional portfolio demonstrations, not completed client engagements.</p>
          <div className="hero-actions">
            <Link className="primary-button" href="/contact">Discuss Your Project <ArrowRight size={18}/></Link>
            <Link className="secondary-button" href="/services">Explore Services</Link>
          </div>
        </div>
        <div className="about-card" style={{marginTop:42,padding:"30px 34px",textAlign:"left"}}>
          <span className="section-label"><Sparkles size={14} style={{display:"inline",marginRight:8}}/>TRANSPARENT BY DESIGN</span>
          <h2 style={{fontSize:"clamp(22px,3vw,34px)"}}>Sample concepts, clearly labelled.</h2>
          <p style={{marginTop:12}}>Explore four working demonstration pages. All brands, listings, prices and sample interactions are fictional; none are presented as paid client work.</p>
        </div>
        <section style={{paddingTop:78}}>
          <div className="section-heading">
            <div><span className="section-label">PROJECT SHOWCASE</span><h2>What we can create.</h2></div>
            <p>Each concept is designed around a practical business use case. We will publish interactive demonstrations as they become available.</p>
          </div>
          <div className="products-page-grid" style={{marginTop:42}}>
            {projects.map((project)=>{
              const Icon=project.icon;
              return <article key={project.number} className="product-detail-card">
                <div className="product-detail-top"><div className="product-detail-icon"><Icon size={24}/></div><span className="product-status">{project.category}</span></div>
                <span className="product-detail-number">{project.number}</span>
                <h2>{project.title}</h2>
                <p>{project.description}</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:18}}>{project.features.map(f=><span key={f} style={{border:"1px solid rgba(91,165,255,.25)",borderRadius:99,padding:"7px 10px",fontSize:12,color:"#b8d9fa"}}>{f}</span>)}</div>
                <p style={{marginTop:20,fontSize:12,color:"#87a8c7"}}>{project.status}</p>
                {project.href ? <Link href={project.href}>View Live Demo <ArrowRight size={16}/></Link> : <Link href="/contact">Request something similar <ArrowRight size={16}/></Link>}
              </article>;
            })}
          </div>
        </section>
        <section className="cta-section" style={{width:"100%",marginTop:90,marginBottom:30}}>
          <div className="cta-glow"/>
          <span className="section-label"><MessageSquare size={14} style={{display:"inline",marginRight:8}}/>LET'S BUILD TOGETHER</span>
          <h2>Have a project in mind?</h2>
          <p>Tell us what your business needs. We'll discuss scope, feasibility and the next steps before any work begins.</p>
          <div className="hero-actions" style={{justifyContent:"center"}}>
            <Link href="/contact" className="primary-button">Start a Conversation <ArrowRight size={18}/></Link>
            <Link href="/" className="secondary-button"><Globe2 size={17}/> Synqo AI Home</Link>
          </div>
        </section>
      </section>
    </main>
  );
}

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
  { number:"01", icon:UtensilsCrossed, category:"Website concept", title:"Restaurant & Café Website", description:"A hospitality concept with a curated menu, atmospheric design and interactive reservation preview.", features:["Interactive reservations","Curated menu","Responsive layout"], status:"Live interactive demo", href:"/demo/restaurant" },
  { number:"02", icon:Building2, category:"Website concept", title:"Real Estate Website", description:"An elegant real estate experience with responsive listing cards and live price filters.", features:["Live price filters","Property listings","Responsive layout"], status:"Live interactive demo", href:"/demo/real-estate" },
  { number:"03", icon:CalendarDays, category:"Website concept", title:"Salon & Barber Booking", description:"A refined grooming experience with selectable services and instant sample pricing.", features:["Service selector","Price preview","Mobile-ready"], status:"Live interactive demo", href:"/demo/salon" },
  { number:"04", icon:Bot, category:"AI prototype", title:"Customer Support Assistant", description:"A conversational interface with interactive scripted FAQ responses and guided actions.", features:["Interactive chat","FAQ flows","Guided responses"], status:"Live interactive demo", href:"/demo/assistant" },
];

export default function PortfolioPage() {
  return (
    <main className="products-page portfolio-premium">
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
            <p>Each concept is designed around a practical business use case. Explore four live interactive demos built to illustrate practical business use cases.</p>
          </div>
          <div className="products-page-grid" style={{marginTop:42}}>
            {projects.map((project)=>{
              const Icon=project.icon;
              return <article key={project.number} className="product-detail-card portfolio-demo-card">
                <div className={"portfolio-preview portfolio-preview-"+project.number}><div className="portfolio-preview-shine"/><div className="portfolio-preview-browser"><span/><span/><span/><i>synqo.ai / demo</i></div><div className="portfolio-preview-content"><div className="portfolio-preview-symbol"><Icon size={42}/></div><div className="portfolio-preview-lines"><b/><b/><b/></div></div><div className="portfolio-preview-orb"/></div><div className="product-detail-top"><div className="product-detail-icon"><Icon size={24}/></div><span className="product-status">{project.category}</span></div>
                <span className="product-detail-number">{project.number}</span>
                <h2>{project.title}</h2>
                <p>{project.description}</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:18}}>{project.features.map(f=><span key={f} style={{border:"1px solid rgba(91,165,255,.25)",borderRadius:99,padding:"7px 10px",fontSize:12,color:"#b8d9fa"}}>{f}</span>)}</div>
                <p style={{marginTop:20,fontSize:12,color:"#87a8c7"}}>{project.status}</p>
                <div className="portfolio-demo-action">{project.href ? <Link href={project.href} className="portfolio-demo-link"><span>Explore Demo</span><ArrowRight size={16}/></Link> : <Link href="/contact" className="portfolio-demo-link"><span>Enquire About This</span><ArrowRight size={16}/></Link>}</div>
              </article>;
            })}
          </div>
        </section>
        <style jsx global>{` .portfolio-demo-card { display:flex; flex-direction:column; padding-bottom:26px; min-height:390px; } .portfolio-demo-action { position:relative; z-index:5; margin-top:auto; padding-top:22px; } .portfolio-demo-card .portfolio-demo-action a.portfolio-demo-link { position:static !important; left:auto !important; bottom:auto !important; display:inline-flex; align-items:center; justify-content:center; gap:10px; padding:13px 17px; background:linear-gradient(115deg,#1671db,#3951bb); color:#fff; border:1px solid #77b8ff70; border-radius:11px; box-shadow:0 9px 25px #0b6fe62e; width:max-content; max-width:100%; font-size:13px; line-height:1.2; white-space:nowrap; text-decoration:none; } .portfolio-demo-card .portfolio-demo-action a.portfolio-demo-link:hover { background:linear-gradient(115deg,#238cff,#6059d9); } @media(max-width:680px){.portfolio-demo-card{min-height:370px}} `} .portfolio-premium .products-page-heading h1{font-size:clamp(52px,7vw,94px);letter-spacing:-.065em}.portfolio-premium .products-page-grid{gap:24px}.portfolio-premium .portfolio-demo-card{padding:0 0 26px;min-height:0;overflow:hidden;border:1px solid #6a9de84d;background:linear-gradient(145deg,#122746,#060d20);transition:transform .35s ease,border-color .35s,box-shadow .35s;box-shadow:0 30px 65px #0004}.portfolio-premium .portfolio-demo-card:hover{transform:translateY(-8px);border-color:#83c6ffb0;box-shadow:0 35px 80px #0b65c33b}.portfolio-premium .portfolio-demo-card>.product-detail-top,.portfolio-premium .portfolio-demo-card>.product-detail-number,.portfolio-premium .portfolio-demo-card>h2,.portfolio-premium .portfolio-demo-card>p,.portfolio-premium .portfolio-demo-card>div:not(.portfolio-preview):not(.product-detail-top):not(.portfolio-demo-action){margin-left:25px;margin-right:25px}.portfolio-premium .portfolio-demo-card .product-detail-top{margin-top:24px}.portfolio-premium .portfolio-demo-card>h2{font-size:clamp(22px,2vw,27px)}.portfolio-premium .portfolio-demo-action{margin-left:25px;margin-right:25px}.portfolio-preview{height:230px;position:relative;overflow:hidden;isolation:isolate;background:radial-gradient(circle at 70% 40%,#bb815b75,#2a3d35 42%,#101e24 85%);border-bottom:1px solid #ffffff26;perspective:650px}.portfolio-preview-02{background:radial-gradient(circle at 70% 40%,#9ed4e270,#274f67 45%,#0a1d2b 90%)}.portfolio-preview-03{background:radial-gradient(circle at 70% 40%,#c58f9b80,#493047 47%,#17121f 95%)}.portfolio-preview-04{background:radial-gradient(circle at 70% 40%,#8072ff9c,#243a7d 48%,#0b1131 95%)}.portfolio-preview:before{content:"";position:absolute;inset:-50%;background:repeating-linear-gradient(0deg,transparent 0 39px,#ffffff09 40px),repeating-linear-gradient(90deg,transparent 0 39px,#ffffff09 40px);transform:rotateX(65deg) translateY(65px);animation:portfolio-grid 14s linear infinite}.portfolio-preview-browser{position:absolute;top:24px;left:28px;right:28px;height:31px;border:1px solid #ffffff45;border-radius:9px;background:#ffffff1b;display:flex;align-items:center;gap:6px;padding:0 12px;backdrop-filter:blur(14px);box-shadow:0 10px 30px #0003}.portfolio-preview-browser span{height:6px;width:6px;border-radius:50%;background:#ffffff9c}.portfolio-preview-browser i{margin-left:12px;font-size:9px;color:#e8f0ffb0;font-style:normal;letter-spacing:1px}.portfolio-preview-content{position:absolute;top:78px;left:35px;right:35px;display:flex;align-items:center;justify-content:space-between;gap:25px;transform:rotateY(-9deg) rotateX(6deg);transition:transform .5s}.portfolio-demo-card:hover .portfolio-preview-content{transform:rotateY(0) rotateX(0) translateY(-5px)}.portfolio-preview-symbol{width:105px;height:105px;border:1px solid #ffffff70;border-radius:27px;background:linear-gradient(135deg,#ffffff45,#ffffff08);display:grid;place-items:center;color:#fff;box-shadow:15px 20px 35px #0006,0 0 35px #ffffff2b;backdrop-filter:blur(14px)}.portfolio-preview-lines{width:45%;display:grid;gap:12px}.portfolio-preview-lines b{height:12px;background:#ffffff65;border-radius:30px;box-shadow:0 0 18px #ffffff33}.portfolio-preview-lines b:nth-child(2){width:80%;opacity:.65}.portfolio-preview-lines b:nth-child(3){width:55%;opacity:.45}.portfolio-preview-orb{position:absolute;width:180px;height:180px;right:-70px;bottom:-110px;border:1px solid #ffffff5e;border-radius:50%;box-shadow:0 0 60px #ffffff28}.portfolio-preview-shine{position:absolute;inset:0;background:linear-gradient(120deg,transparent 35%,#ffffff17 50%,transparent 65%);transform:translateX(-100%);transition:transform .7s}.portfolio-demo-card:hover .portfolio-preview-shine{transform:translateX(100%)}@keyframes portfolio-grid{to{background-position:0 80px,80px 0}}@media(max-width:680px){.portfolio-preview{height:205px}.portfolio-premium .portfolio-demo-card{padding-bottom:24px}}@media(prefers-reduced-motion:reduce){.portfolio-preview:before{animation:none}.portfolio-premium .portfolio-demo-card,.portfolio-preview-content,.portfolio-preview-shine{transition:none}} `}</style>
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

"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BedDouble, Bath, MapPin, Maximize } from "lucide-react";

const homes = [
  { name: "The Willow Residence", area: "Downtown District", price: 849000, beds: 3, baths: 2, size: "1,850 sq ft", photo: "photo-1600596542815-ffad4c1539a9" },
  { name: "Skyline Penthouse", area: "Harbour District", price: 1240000, beds: 2, baths: 2, size: "1,620 sq ft", photo: "photo-1600607687939-ce8a6c25118c" },
  { name: "The Garden House", area: "Westside Neighbourhood", price: 975000, beds: 4, baths: 3, size: "2,300 sq ft", photo: "photo-1600047509807-ba8f99d2cdde" },
];
const money = (n: number) => n.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
export default function RealEstateDemo() {
  const [max, setMax] = useState("all");
  const [selected, setSelected] = useState(0);
  const [down, setDown] = useState(20);
  const [rate, setRate] = useState(4.5);
  const [years, setYears] = useState(25);
  const filtered = homes.filter(h => max === "all" || h.price <= Number(max));
  const loan = homes[selected].price * (1 - down / 100);
  const monthlyRate = rate / 1200;
  const months = years * 12;
  const payment = monthlyRate === 0 ? loan / months : loan * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));
  return (
    <main style={{ background: "#f7f7f4", color: "#16252b", fontFamily: "Arial,sans-serif", minHeight: "100vh" }}>
      <div style={{ background: "#102a35", color: "#fff", textAlign: "center", padding: 10, fontSize: 12 }}>SYNQO AI STUDIO — FICTIONAL REAL ESTATE DEMO • SAMPLE LISTINGS AND PRICES</div>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 6%", gap: 20, flexWrap: "wrap" }}>
        <Link href="/portfolio" style={{ display: "flex", gap: 8, alignItems: "center" }}><ArrowLeft size={16} /> Portfolio</Link>
        <strong style={{ fontSize: 25, letterSpacing: 2 }}>NORTHLINE <span style={{ color: "#ad8d58" }}>ESTATES</span></strong>
        <a href="#properties">Properties</a>
      </header>
      <section style={{ padding: "100px 6%", background: "linear-gradient(115deg,#102a35,#345967)", color: "white" }}>
        <span style={{ color: "#e2c18e", letterSpacing: 3 }}>CURATED HOMES • DISTINCTIVE LIVING</span>
        <h1 style={{ fontSize: "clamp(45px,8vw,92px)", maxWidth: 850, margin: "25px 0", lineHeight: 1.05 }}>Find a place to <em style={{ color: "#e2c18e" }}>belong.</em></h1>
        <p style={{ fontSize: 18, lineHeight: 1.8, maxWidth: 570, color: "#d4e0e3" }}>Explore a polished property-search experience built to help agencies showcase homes and capture buyer interest.</p>
        <a href="#properties" style={{ display: "inline-flex", gap: 8, alignItems: "center", marginTop: 30, padding: "16px 25px", background: "#e2c18e", color: "#16252b", borderRadius: 6, fontWeight: 700 }}>Explore Properties <ArrowRight size={17} /></a>
      </section>
      <section id="properties" style={{ padding: "80px 6%" }}>
        <span style={{ color: "#997444", letterSpacing: 2 }}>FEATURED COLLECTION</span>
        <h2 style={{ fontSize: "clamp(32px,5vw,56px)", margin: "16px 0 35px" }}>Homes worth discovering.</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 25 }}>
          <label htmlFor="price-filter">Maximum price</label>
          <select id="price-filter" value={max} onChange={e => setMax(e.target.value)} style={{ padding: "12px 18px", borderRadius: 10, border: "1px solid #b4c8ca", background: "white", color: "#102a35" }}>
            <option value="all">All properties</option>
            <option value="900000">Up to $900,000</option>
            <option value="1000000">Up to $1,000,000</option>
            <option value="1500000">Up to $1,500,000</option>
          </select>
          <span>{filtered.length} sample properties</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 22 }}>
          {filtered.map(h => (
            <article key={h.name} style={{ background: "white", borderRadius: 14, overflow: "hidden", boxShadow: "0 12px 35px #00000012" }}>
              <div style={{ height: 230, backgroundImage: `linear-gradient(0deg,#102a3550,#102a3500),url(https://images.unsplash.com/${h.photo}?auto=format&fit=crop&w=1000&q=85)`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <div style={{ padding: 24 }}>
                <strong style={{ color: "#997444", fontSize: 22 }}>{money(h.price)}</strong>
                <h3 style={{ fontSize: 23, margin: "14px 0 8px" }}>{h.name}</h3>
                <p style={{ display: "flex", alignItems: "center", gap: 5, color: "#64767a", fontSize: 13 }}><MapPin size={14} />{h.area}</p>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 20, fontSize: 12, color: "#40555c" }}>
                  <span><BedDouble size={15} /> {h.beds} beds</span>
                  <span><Bath size={15} /> {h.baths} baths</span>
                  <span><Maximize size={15} /> {h.size}</span>
                </div>
                <button type="button" onClick={() => { setSelected(homes.indexOf(h)); document.getElementById("mortgage")?.scrollIntoView({ behavior: "smooth" }); }} style={{ marginTop: 18, padding: "12px 16px", background: "#102a35", color: "white", border: 0, borderRadius: 7, cursor: "pointer", width: "100%" }}>Estimate Mortgage →</button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section id="mortgage" style={{ padding: "80px 6%", background: "#e5eceb" }}>
        <span style={{ color: "#997444", letterSpacing: 2, fontSize: 12 }}>INTERACTIVE FINANCING PREVIEW</span>
        <h2 style={{ fontSize: "clamp(32px,5vw,56px)", margin: "16px 0 20px" }}>Explore your monthly payment.</h2>
        <p style={{ color: "#576e73", maxWidth: 650, lineHeight: 1.8 }}>Sample mortgage calculator using fictional listings. Estimates exclude taxes, insurance, fees and other costs; not financial advice.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 30, marginTop: 30 }}>
          <div style={{ background: "white", padding: 30, borderRadius: 16, display: "grid", gap: 20 }}>
            <label style={{ display: "grid", gap: 8 }}>Property
              <select value={selected} onChange={e => setSelected(Number(e.target.value))} style={{ padding: 12, border: "1px solid #bbc9c9", borderRadius: 7 }}>
                {homes.map((h, i) => <option key={h.name} value={i}>{h.name} — {money(h.price)}</option>)}
              </select>
            </label>
            <label>Down payment: {down}%<input type="range" min="5" max="60" value={down} onChange={e => setDown(Number(e.target.value))} style={{ width: "100%" }} /></label>
            <label>Interest rate: {rate.toFixed(1)}%<input type="range" min="1" max="12" step=".1" value={rate} onChange={e => setRate(Number(e.target.value))} style={{ width: "100%" }} /></label>
            <label>Amortization: {years} years<input type="range" min="5" max="30" step="5" value={years} onChange={e => setYears(Number(e.target.value))} style={{ width: "100%" }} /></label>
          </div>
          <div style={{ background: "#102a35", color: "white", borderRadius: 16, padding: 35, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span style={{ color: "#b4c9d0" }}>Estimated monthly principal & interest</span>
            <strong style={{ fontSize: "clamp(42px,6vw,70px)", margin: "15px 0", color: "#e2c18e" }}>{money(payment)}</strong>
            <p style={{ color: "#c6d9dd" }}>Loan amount: {money(loan)}</p>
            <p style={{ fontSize: 12, color: "#9fb4ba", lineHeight: 1.8 }}>Illustrative calculator only. No financing is offered.</p>
          </div>
        </div>
      </section>
      <section style={{ background: "#102a35", color: "white", padding: "80px 6%", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(32px,5vw,55px)" }}>A better first impression for your agency.</h2>
        <p style={{ margin: "20px auto", maxWidth: 650, lineHeight: 1.8, color: "#d3dfe2" }}>This is a design demonstration. Listings, prices, and brand are fictional. No property is offered for sale.</p>
        <Link href="/contact" style={{ display: "inline-flex", gap: 10, alignItems: "center", background: "#e2c18e", color: "#102a35", padding: "15px 22px", borderRadius: 6, fontWeight: 700 }}>Request a Website <ArrowRight size={17} /></Link>
      </section>
    </main>
  );
}

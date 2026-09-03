"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  ChevronRight,
  Mail,
  Menu,
  MessageSquare,
  Sparkles,
  UserPlus,
  X,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import InteractiveBackground from "@/components/InteractiveBackground";
import LoadingScreen from "@/components/LoadingScreen";
import BackToTop from "@/components/BackToTop";
import NeuralCore3D from "@/components/NeuralCore3D";

const features = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Customer Conversations",
    description:
      "Respond to customer enquiries quickly, handle common questions and keep conversations moving without constant manual work.",
  },
  {
    number: "02",
    icon: UserPlus,
    title: "Lead Capture",
    description:
      "Turn incoming enquiries into organized leads by collecting the right details and keeping every opportunity in one place.",
  },
  {
    number: "03",
    icon: CalendarCheck,
    title: "Appointments & Follow-Ups",
    description:
      "Help customers book appointments and automatically follow up so important opportunities do not get forgotten.",
  },
];

const jobs = [
  "Answer Customer Enquiries",
  "Capture & Organize Leads",
  "Book Appointments",
  "Send Follow-Ups",
  "Assist With Business Email",
  "Handle Repetitive Tasks",
];

const reveal = {
  hidden: {
    opacity: 0,
    y: 34,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.65,
      ease: "easeOut" as const,
    },
  },
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll();

  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <>
      <LoadingScreen />

      <InteractiveBackground />

      <BackToTop />

      <main>
        {/* Scroll progress */}
        <motion.div
          style={{ scaleX: progress }}
          className="fixed left-0 top-0 z-[100] h-[3px] w-full origin-left bg-blue-500"
        />

        {/* Background */}
        <div className="site-background" aria-hidden="true">
          <div className="glow glow-one" />
          <div className="glow glow-two" />
          <div className="grid-overlay" />

          <motion.div
            animate={{
              x: [0, 90, 0],
              y: [0, -55, 0],
              opacity: [0.18, 0.34, 0.18],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute right-[8%] top-[15%] h-72 w-72 rounded-full bg-blue-600/20 blur-[120px]"
          />

          <motion.div
            animate={{
              x: [0, -80, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-[15%] left-[5%] h-64 w-64 rounded-full bg-cyan-500/10 blur-[110px]"
          />
        </div>

        {/* NAVBAR */}
        <header className="navbar">
          <a className="brand" href="#home" aria-label="Synqo AI home">
            <motion.span
              whileHover={{
                rotate: -6,
                scale: 1.06,
              }}
              className="brand-mark"
            >
              S
            </motion.span>

            <span className="brand-text">
              SYNQO <strong>AI</strong>
            </span>
          </a>

          {/* Desktop navigation */}
          <nav className="nav-links" aria-label="Main navigation">
            <a href="#product">AI Employee</a>

            <a href="#solutions">Solutions</a>

            <Link href="/services">Services</Link>

            <Link href="/pricing">Pricing</Link>

            <Link href="/about">About</Link>
          </nav>

          <Link className="nav-button hidden sm:inline-flex" href="/contact">
            Request Access
            <ArrowRight size={17} />
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label="Open mobile menu"
            onClick={() => setMenuOpen((current) => !current)}
            className="grid h-11 w-11 place-items-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-100 sm:hidden"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>

          {/* Mobile navigation */}
          {menuOpen && (
            <motion.div
              initial={{
                opacity: 0,
                y: -12,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              className="absolute left-3 right-3 top-[78px] rounded-2xl border border-blue-400/20 bg-[#040b16]/95 p-4 shadow-2xl backdrop-blur-2xl sm:hidden"
            >
              {[
                ["AI Employee", "product"],
                ["Solutions", "solutions"],
              ].map(([label, id]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-4 text-sm font-semibold text-slate-200 hover:bg-blue-500/10"
                >
                  {label}

                  <ChevronRight size={16} className="text-blue-400" />
                </a>
              ))}

              <Link
                href="/services"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-4 text-sm font-semibold text-slate-200 hover:bg-blue-500/10"
              >
                Services
                <ChevronRight size={16} className="text-blue-400" />
              </Link>

              <Link
                href="/pricing"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-4 text-sm font-semibold text-slate-200 hover:bg-blue-500/10"
              >
                Pricing
                <ChevronRight size={16} className="text-blue-400" />
              </Link>

              <Link
                href="/about"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-4 text-sm font-semibold text-slate-200 hover:bg-blue-500/10"
              >
                About
                <ChevronRight size={16} className="text-blue-400" />
              </Link>
            </motion.div>
          )}
        </header>

        {/* HERO */}
        <section className="hero" id="home">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},

              visible: {
                transition: {
                  staggerChildren: 0.12,
                },
              },
            }}
            className="hero-content"
          >
            <motion.div variants={reveal} className="eyebrow">
              <span className="eyebrow-icon">
                <Sparkles size={18} />
              </span>
              Introducing Synqo AI Employee
            </motion.div>

            <motion.h1 variants={reveal}>
              Your AI Employee.
              <br />
              <span>Built for everyday business work.</span>
            </motion.h1>

            <motion.p variants={reveal} className="hero-description">
              Synqo AI Employee helps businesses handle customer enquiries,
              capture leads, book appointments, send follow-ups and automate
              repetitive work from one intelligent system.
            </motion.p>

            <motion.div variants={reveal} className="hero-actions">
              <Link className="primary-button" href="/signup">
                Start Free Trial
                <ArrowRight size={18} />
              </Link>

              <a className="secondary-button" href="#solutions">
                See How It Works
              </a>
            </motion.div>

            <motion.div variants={reveal} className="hero-meta">
              <div>
                <span className="status-dot" />
                Currently building
              </div>

              <strong>Synqo AI Employee — Early Stage Product</strong>
            </motion.div>
          </motion.div>

          <NeuralCore3D />
        </section>

        {/* Trust strip */}
        <section className="trust-strip">
          <span>CUSTOMER ENQUIRIES</span>

          <span className="divider-dot" />

          <span>LEAD CAPTURE</span>

          <span className="divider-dot" />

          <span>APPOINTMENTS</span>

          <span className="divider-dot" />

          <span>FOLLOW-UPS</span>
        </section>

        {/* Solutions */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          variants={reveal}
          className="section"
          id="solutions"
        >
          <div className="section-heading">
            <div>
              <span className="section-label">WHAT YOUR AI EMPLOYEE DOES</span>

              <h2>Routine business work, handled intelligently.</h2>
            </div>

            <p>
              Synqo AI Employee is being designed to support the repetitive
              customer-facing work that takes time away from your team.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.article
                  key={feature.number}
                  initial={{
                    opacity: 0,
                    y: 35,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.12,
                  }}
                  whileHover={{
                    y: -9,
                  }}
                  className="feature-card"
                >
                  <span className="feature-number">{feature.number}</span>

                  <div className="feature-icon">
                    <Icon size={25} />
                  </div>

                  <h3>{feature.title}</h3>

                  <p>{feature.description}</p>

                  <Link href="/contact">
                    Request access
                    <ArrowRight size={16} />
                  </Link>
                </motion.article>
              );
            })}
          </div>
        </motion.section>

        {/* Product */}
        <motion.section
          initial={{
            opacity: 0,
            y: 45,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.18,
          }}
          transition={{
            duration: 0.7,
          }}
          className="section products-section"
          id="product"
        >
          <div className="product-panel">
            <div className="product-copy">
              <span className="section-label">
                ONE AI EMPLOYEE. MULTIPLE JOBS.
              </span>

              <h2>
                One intelligent workspace for everyday business operations.
              </h2>

              <p>
                Instead of switching between disconnected tools, Synqo AI
                Employee is being built as one system that can assist across
                customer communication, leads, scheduling and follow-ups.
              </p>

              <Link className="primary-button" href="/signup">
                Try AI Employee
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="product-list">
              {jobs.map((job, index) => (
                <motion.div
                  key={job}
                  whileHover={{
                    x: 10,
                    scale: 1.02,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  className="product-item premium-product-item"
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>

                  <strong>{job}</strong>

                  <ArrowRight size={17} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* About */}
        <motion.section
          initial={{
            opacity: 0,
            scale: 0.97,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.65,
          }}
          className="section about-section"
          id="about"
        >
          <div className="about-card">
            <span className="section-label">BUILT BY SYNQO AI</span>

            <h2>We are building AI that works like part of your team.</h2>

            <p>
              Synqo AI is building practical artificial intelligence for real
              business operations. Our first flagship product, Synqo AI
              Employee, is focused on reducing repetitive work while keeping
              businesses in control.
            </p>

            <Link className="secondary-button" href="/about">
              About Synqo AI
              <ArrowRight size={17} />
            </Link>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
          }}
          className="cta-section"
          id="contact"
        >
          <div className="cta-glow" />

          <span className="section-label">EARLY ACCESS</span>

          <h2>Want an AI Employee for your business?</h2>

          <p>
            Synqo AI Employee is currently in development. Join early access,
            tell us about your business and be among the first to see the
            product.
          </p>

          <div className="hero-actions">
            <Link className="primary-button" href="/signup">
              Start Free Trial
              <ArrowRight size={18} />
            </Link>

            <a className="secondary-button" href="mailto:synqoai@yahoo.com">
              <Mail size={17} />
              Contact Synqo AI
            </a>
          </div>
        </motion.section>

        {/* Footer */}
        <footer>
          <a className="brand" href="#home">
            <span className="brand-mark">S</span>

            <span className="brand-text">
              SYNQO <strong>AI</strong>
            </span>
          </a>

          <p>Building practical AI for modern businesses.</p>

          <div className="footer-links">
            <Link href="/">Home</Link>

            <Link href="/about">About</Link>

            <Link href="/products">AI Employee</Link>

            <Link href="/services">Services</Link>

            <Link href="/pricing">Pricing</Link>

            <Link href="/contact">Contact</Link>

            <Link href="/privacy">Privacy</Link>

            <Link href="/terms">Terms</Link>
          </div>

          <small>© 2026 Synqo AI. All rights reserved.</small>
        </footer>
      </main>
    </>
  );
}

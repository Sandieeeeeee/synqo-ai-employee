"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight, Menu, X } from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Services", href: "/services" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <Link
        className="brand"
        href="/"
        aria-label="Go to Synqo AI homepage"
        onClick={closeMenu}
      >
        <motion.span
          whileHover={{ rotate: -6, scale: 1.06 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
          className="brand-mark"
        >
          S
        </motion.span>

        <span className="brand-text">
          SYNQO <strong>AI</strong>
        </span>
      </Link>

      <nav className="nav-links" aria-label="Main navigation">
        {navigation.slice(1).map((item) => (
          <Link key={item.name} href={item.href}>
            {item.name}
          </Link>
        ))}
      </nav>

      <Link className="nav-button hidden sm:inline-flex" href="/contact">
        Get Started
        <ArrowRight size={17} />
      </Link>

      <button
        type="button"
        aria-label={menuOpen ? "Close mobile menu" : "Open mobile menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((current) => !current)}
        className="grid h-11 w-11 place-items-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-100 sm:hidden"
      >
        {menuOpen ? <X size={21} /> : <Menu size={21} />}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute left-3 right-3 top-[78px] rounded-2xl border border-blue-400/20 bg-[#040b16]/95 p-4 shadow-2xl backdrop-blur-2xl sm:hidden"
          >
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMenu}
                className="flex items-center justify-between rounded-xl px-4 py-4 text-sm font-semibold text-slate-200 transition hover:bg-blue-500/10"
              >
                {item.name}
                <ChevronRight size={16} className="text-blue-400" />
              </Link>
            ))}

            <Link
              href="/contact"
              onClick={closeMenu}
              className="primary-button mt-3 w-full"
            >
              Start a Project
              <ArrowRight size={17} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

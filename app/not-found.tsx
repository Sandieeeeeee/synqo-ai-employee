"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import InteractiveBackground from "@/components/InteractiveBackground";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <InteractiveBackground />

      <motion.div
        className="not-found-content"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>404</h1>

        <h2>Page Not Found</h2>

        <p>The page you're looking for doesn't exist or has been moved.</p>

        <Link href="/" className="primary-button">
          <Home size={18} />
          Back to Home
        </Link>
      </motion.div>
    </main>
  );
}

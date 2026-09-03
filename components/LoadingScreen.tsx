"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.5,
              ease: "easeInOut",
            },
          }}
          className="loading-screen"
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.82,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.45,
              ease: "easeOut",
            }}
            className="loading-logo-wrap"
          >
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="loading-ring"
            />

            <div className="loading-logo">S</div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.25,
              duration: 0.4,
            }}
          >
            SYNQO <span>AI</span>
          </motion.h2>

          <div className="loading-bar">
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 1.2,
                ease: "easeInOut",
              }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.45,
              duration: 0.4,
            }}
          >
            Building intelligent software
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

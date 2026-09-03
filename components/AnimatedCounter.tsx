"use client";

import { animate, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  duration?: number;
};

export default function AnimatedCounter({
  value,
  suffix = "",
  duration = 1.8,
}: AnimatedCounterProps) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(counterRef, {
    once: true,
    margin: "-80px",
  });

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate(latest) {
        setDisplayValue(Math.floor(latest));
      },
    });

    return () => controls.stop();
  }, [duration, isInView, value]);

  return (
    <motion.span
      ref={counterRef}
      initial={{ opacity: 0, y: 12 }}
      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
            }
          : {}
      }
      transition={{
        duration: 0.45,
      }}
    >
      {displayValue.toLocaleString()}
      {suffix}
    </motion.span>
  );
}

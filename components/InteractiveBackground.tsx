"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useMemo } from "react";

type Particle = {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
};

export default function InteractiveBackground() {
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  const smoothX = useSpring(mouseX, {
    stiffness: 90,
    damping: 24,
    mass: 0.7,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 90,
    damping: 24,
    mass: 0.7,
  });

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        left: (index * 37) % 100,
        top: (index * 53) % 100,
        size: 2 + (index % 4),
        duration: 7 + (index % 8),
        delay: (index % 10) * 0.45,
      })),
    [],
  );

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    const handleMouseLeave = () => {
      mouseX.set(-500);
      mouseY.set(-500);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave,
      );
    };
  }, [mouseX, mouseY]);

  return (
    <div className="interactive-background" aria-hidden="true">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <div className="aurora aurora-three" />

      <motion.div
        className="mouse-glow"
        style={{
          x: smoothX,
          y: smoothY,
        }}
      />

      <div className="particle-layer">
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="background-particle"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: particle.size,
              height: particle.size,
            }}
            animate={{
              y: [0, -35, 0],
              x: [0, 12, -8, 0],
              opacity: [0.12, 0.65, 0.18],
              scale: [0.8, 1.25, 0.9],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="background-noise" />
      <div className="background-vignette" />
    </div>
  );
}

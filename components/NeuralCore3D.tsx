"use client";

import {
  Bot,
  CalendarCheck,
  MessageSquare,
  Sparkles,
  UserPlus,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import type { PointerEvent } from "react";

import styles from "./NeuralCore3D.module.css";

const signals = [18, 31, 24, 48, 39, 64, 53, 78, 67, 92, 82, 100];

export default function NeuralCore3D() {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 130,
    damping: 20,
  });
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [7, -7]), {
    stiffness: 130,
    damping: 20,
  });

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  }

  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 70, scale: 0.94 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
      className={styles.scene}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      aria-label="Interactive Synqo AI command core showing customer conversations, leads and appointments"
    >
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.gridFloor} aria-hidden="true" />

      <motion.div
        className={styles.stage}
        style={reduceMotion ? undefined : { rotateX, rotateY }}
      >
        <div className={styles.hud} aria-hidden="true">
          <span>SYNQO // NEURAL OPERATIONS</span>
          <span className={styles.live}><i /> SYSTEM LIVE</span>
        </div>

        <div className={styles.coreWrap} aria-hidden="true">
          <div className={`${styles.ring} ${styles.ringOne}`} />
          <div className={`${styles.ring} ${styles.ringTwo}`} />
          <div className={`${styles.ring} ${styles.ringThree}`} />
          <div className={styles.orbHalo} />
          <motion.div
            className={styles.orb}
            animate={reduceMotion ? undefined : { scale: [1, 1.055, 1] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className={styles.orbMesh} />
            <Sparkles size={30} />
          </motion.div>
          <span className={`${styles.node} ${styles.nodeOne}`} />
          <span className={`${styles.node} ${styles.nodeTwo}`} />
          <span className={`${styles.node} ${styles.nodeThree}`} />
        </div>

        <motion.div
          className={`${styles.signalCard} ${styles.inboxCard}`}
          animate={reduceMotion ? undefined : { y: [0, -9, 0] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className={styles.cardIcon}><MessageSquare size={17} /></span>
          <span><small>Customer inbox</small><strong>12 conversations</strong></span>
          <b>+8%</b>
        </motion.div>

        <motion.div
          className={`${styles.signalCard} ${styles.leadsCard}`}
          animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className={styles.cardIcon}><UserPlus size={17} /></span>
          <span><small>Lead capture</small><strong>24 organized</strong></span>
          <b>LIVE</b>
        </motion.div>

        <motion.div
          className={`${styles.signalCard} ${styles.bookingCard}`}
          animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
          transition={{ duration: 4.9, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className={styles.cardIcon}><CalendarCheck size={17} /></span>
          <span><small>Appointments</small><strong>7 booked today</strong></span>
        </motion.div>

        <div className={styles.commandPanel}>
          <div className={styles.commandTop}>
            <span><Bot size={15} /> Synqo Business Assistant</span>
            <small>ONLINE</small>
          </div>
          <div className={styles.commandCopy}>
            <span>Business activity</span>
            <strong>Work moving forward</strong>
          </div>
          <div className={styles.signalBars} aria-hidden="true">
            {signals.map((height, index) => (
              <motion.i
                key={`${height}-${index}`}
                initial={{ height: 4 }}
                animate={reduceMotion ? { height: `${height}%` } : { height: [4, `${height}%`] }}
                transition={{ duration: 0.8, delay: 0.8 + index * 0.045, ease: "easeOut" }}
              />
            ))}
          </div>
        </div>

        <div className={styles.coreLabel} aria-hidden="true">
          <span>AI EMPLOYEE</span>
          <strong>UNDERSTAND · ORGANIZE · ACT</strong>
        </div>
      </motion.div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

// Fade in from bottom
export function FadeIn({
    children,
    delay = 0,
    className = "",
}: {
    children: ReactNode;
    delay?: number;
    className?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Fade in when in viewport
export function FadeInView({
    children,
    delay = 0,
    className = "",
}: {
    children: ReactNode;
    delay?: number;
    className?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Scale up on hover
export function ScaleHover({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Stagger children
export function StaggerContainer({
    children,
    className = "",
    staggerDelay = 0.1,
}: {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
}) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
                hidden: {},
                visible: { transition: { staggerChildren: staggerDelay } },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Stagger item
export function StaggerItem({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Slide in from left/right
export function SlideIn({
    children,
    direction = "left",
    delay = 0,
    className = "",
}: {
    children: ReactNode;
    direction?: "left" | "right";
    delay?: number;
    className?: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: direction === "left" ? -60 : 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Floating animation (for decorative elements)
export function FloatingElement({
    children,
    className = "",
    duration = 6,
}: {
    children: ReactNode;
    className?: string;
    duration?: number;
}) {
    return (
        <motion.div
            animate={{
                y: [0, -20, 0],
                rotate: [0, 2, -2, 0],
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Count up number animation
export function CountUp({
    value,
    suffix = "",
    className = "",
}: {
    value: number;
    suffix?: string;
    className?: string;
}) {
    return (
        <motion.span
            className={className}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
        >
            <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                {value}{suffix}
            </motion.span>
        </motion.span>
    );
}

// Magnetic hover effect
export function MagneticHover({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// Glow pulse effect wrapper
export function GlowPulse({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            animate={{
                boxShadow: [
                    "0 0 20px rgba(139, 92, 246, 0)",
                    "0 0 30px rgba(139, 92, 246, 0.15)",
                    "0 0 20px rgba(139, 92, 246, 0)",
                ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

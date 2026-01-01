"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number
    max?: number
    label?: string
}

export function RiskGauge({ value, max = 100, className, label }: ProgressProps) {
    const radius = 85;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const offset = circumference - (value / max) * circumference;

    // Professional color logic based on the Enterprise theme
    const getHexColor = (v: number) => {
        if (v < 30) return "#ef4444"; // red-500
        if (v < 60) return "#eab308"; // yellow-500
        return "#10b981"; // emerald-500
    };

    const finalColor = getHexColor(value);

    return (
        <motion.div
            className={cn("relative flex items-center justify-center select-none", className)}
            initial={{ color: "#ef4444" }}
            animate={{ color: finalColor }}
            transition={{ duration: 2, ease: "easeOut" }}
        >
            <svg className="transform -rotate-90 w-56 h-56">
                {/* Background Ring - Precise Ticks */}
                <circle
                    cx="112"
                    cy="112"
                    r={normalizedRadius}
                    stroke="currentColor"
                    strokeWidth={stroke}
                    fill="transparent"
                    className="text-muted/10"
                />

                {/* Ticks Simulation */}
                {[...Array(24)].map((_, i) => (
                    <line
                        key={i}
                        x1="112"
                        y1="112"
                        x2="112"
                        y2="20"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-muted/20"
                        transform={`rotate(${i * 15} 112 112)`}
                        strokeDasharray="4 180"
                    />
                ))}

                {/* Data Value Ring */}
                <motion.circle
                    cx="112"
                    cy="112"
                    r={normalizedRadius}
                    stroke="currentColor"
                    strokeWidth={stroke}
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    strokeLinecap="round"
                />

                {/* Inner Decorative Glow */}
                <circle
                    cx="112"
                    cy="112"
                    r={normalizedRadius - 10}
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-primary/5"
                    fill="transparent"
                />
            </svg>

            {/* Central Information Stack */}
            <div className="absolute flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                >
                    <span className="text-6xl font-black tracking-tighter transition-colors duration-500">
                        {Math.round(value)}
                    </span>
                    <div className="h-px w-8 bg-muted/30 my-2" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground whitespace-nowrap">
                        {label || "RISK LEVEL"}
                    </span>
                </motion.div>
            </div>

            {/* Corner Decorative Ticks */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-2 bg-current" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-2 bg-current" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-px w-2 bg-current" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-px w-2 bg-current" />
            </div>
        </motion.div>
    );
}

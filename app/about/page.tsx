"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Shield, Globe, Lock, Users } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            <Navbar />

            <main className="flex-1 pt-24 pb-12">
                {/* Hero Section */}
                <section className="container mx-auto px-6 mb-24 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto space-y-6"
                    >
                        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
                            Protecting digital identities in an interconnected world.
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            IDTrace was founded on a simple principle: everyone deserves to know what the internet knows about them. We provide enterprise-grade intelligence to individuals and organizations.
                        </p>
                    </motion.div>
                </section>

                {/* Mission Grid */}
                <section className="container mx-auto px-6 mb-24">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Shield,
                                title: "Security First",
                                desc: "We operate with a zero-trust architecture. We never store your search data or personal identifiers."
                            },
                            {
                                icon: Globe,
                                title: "Global Intelligence",
                                desc: "Our scanners constantly index the surface, deep, and dark web to find exposed credentials before attackers do."
                            },
                            {
                                icon: Lock,
                                title: "Privacy Centric",
                                desc: "We believe privacy is a fundamental human right. Our tools are designed to empower you, not track you."
                            }
                        ].map((item, i) => (
                            <div key={i} className="glass-card p-8 rounded-2xl border-border/50">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-medium mb-3">{item.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Team Section */}
                <section className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-semibold tracking-tight mb-12">Driven by experts</h2>
                    <div className="flex flex-wrap justify-center gap-12">
                        {/* Placeholder for real team or generic "Security Analysts" */}
                        <div className="space-y-4">
                            <div className="w-24 h-24 mx-auto rounded-full bg-secondary flex items-center justify-center">
                                <Users className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="font-medium">Security Operations</div>
                                <div className="text-xs text-muted-foreground">Global Team</div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-12 border-t border-border/50 text-center text-sm">
                <div className="container mx-auto px-6">
                    <p className="text-muted-foreground">© 2025 IDTrace. Built for a safer web.</p>
                </div>
            </footer>
        </div>
    );
}

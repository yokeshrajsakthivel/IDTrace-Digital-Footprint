"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Shield, Search, Globe, Lock, ShieldCheck, Database, Zap } from "lucide-react";
import { FingerprintIcon } from "@/components/icons";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleScan = () => {
    if (email) {
      router.push(`/analyze?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 container mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs font-medium text-secondary-foreground mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Operational Status: Active
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground max-w-3xl mx-auto">
              Secure your digital identity in an exposed world.
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Enterprise-grade digital footprint analysis and risk intelligence.
              Discover exposed data and identity threats instantly.
            </p>

            <div className="w-full max-w-lg mx-auto pt-8">
              <div className="flex flex-col sm:flex-row gap-2 p-1.5 rounded-lg bg-background/50 backdrop-blur-md border border-border shadow-sm">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search email, username, or domain..."
                    className="h-10 pl-9 bg-transparent border-none text-sm focus-visible:ring-0 shadow-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleScan()}
                  />
                </div>
                <Button
                  className="h-10 px-6 text-sm bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md shadow-sm"
                  onClick={handleScan}
                >
                  Analyze Exposure
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-4 font-medium flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3" />
                No data is stored. Search is 100% anonymous.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Global Stats Bar */}
        <section className="border-y border-border/50 bg-secondary/30 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-12 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Data Records", value: "15.4B+", icon: Database },
              { label: "Sources Scanned", value: "8,200+", icon: Globe },
              { label: "Live Threats", value: "1.2M", icon: Zap },
              { label: "Risk Score Precision", value: "99.9%", icon: ShieldCheck }
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-center space-x-4">
                <div className="p-2 rounded-lg bg-background border border-border/50 shadow-sm">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-semibold tracking-tight tabular-nums">{stat.value}</div>
                  <div className="text-xs font-medium text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Intelligence Pillars */}
        <section id="services" className="py-24 px-6 container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Dark Web Intelligence",
                desc: "Real-time monitoring of black markets, Pastebin, and hidden forums for your credentials.",
                icon: Search
              },
              {
                title: "Breach Correlation",
                desc: "Cross-referencing your identifiers across thousands of known database leaks.",
                icon: Globe
              },
              {
                title: "Asset Exposure",
                desc: "Detecting leaked organizational assets, API keys, and private documentation.",
                icon: Lock
              }
            ].map((pillar, i) => (
              <div key={i} className="glass-card p-8 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <pillar.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold mb-2">{pillar.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border/50 text-center text-sm">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <FingerprintIcon className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground">IDTrace</span>
          </div>

          <p className="text-muted-foreground">
            © 2025 IDTrace Cyber Operations. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Privacy</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Terms</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors font-medium">Compliance</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

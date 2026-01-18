"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { RiskGauge } from "@/components/features/risk-gauge";
import { LocationMap } from "@/components/features/location-map";
import { Shield, AlertTriangle, CheckCircle2, Globe, ShieldAlert, Database, Lock, Loader2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Exposure {
    source: string;
    type: string;
    date: string;
    severity: string;
    dataClasses: string[];
    details: string;
}

interface ScanResult {
    score: number;
    level: string;
    summary: string;
    details: {
        email: string;
        breaches: number;
        exposures: Exposure[];
        stats: {
            scannedProviders: string[];
            successProviders: string[];
            failedProviders: string[];
        };
    }
}

function RadarLoader() {
    return (
        <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Pulsing Circles */}
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border border-primary/30"
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 0 }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 1,
                        ease: "easeOut"
                    }}
                />
            ))}

            {/* Main Radar Sphere */}
            <div className="relative w-32 h-32 rounded-full border border-primary/20 bg-primary/5 overflow-hidden">
                {/* Rotating Sweep */}
                <motion.div
                    className="absolute inset-0 origin-center bg-gradient-to-r from-primary/40 to-transparent"
                    style={{ clipPath: "polygon(50% 50%, 100% 0, 100% 20%, 50% 50%)" }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />

                {/* Grid Lines */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-px bg-primary/10" />
                    <div className="h-full w-px bg-primary/10" />
                    <div className="absolute inset-0 rounded-full border border-primary/10 scale-50" />
                </div>

                {/* Blips */}
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(var(--primary),0.8)]"
                        style={{
                            top: `${20 + Math.random() * 60}%`,
                            left: `${20 + Math.random() * 60}%`
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: Math.random() * 4
                        }}
                    />
                ))}
            </div>

            {/* Center Point */}
            <div className="absolute w-2 h-2 bg-primary rounded-full shadow-lg z-10" />
        </div>
    );
}

function AnalyzeContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<ScanResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedExposure, setSelectedExposure] = useState<Exposure | null>(null);

    useEffect(() => {
        if (!email) {
            setError("No identifiers provided for analysis.");
            setLoading(false);
            return;
        }

        const runScan = async () => {
            try {
                const response = await fetch(`/api/scan?email=${encodeURIComponent(email)}`);
                if (!response.ok) throw new Error("Failed to reach intelligence nodes.");
                const data = await response.json();
                setResult(data);
            } catch (err) {
                setError("Neural link failed. Intelligence sources unreachable.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        runScan();
    }, [email]);

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center space-y-12 p-6 min-h-[70vh]">
                <RadarLoader />
                <div className="text-center space-y-4">
                    <h2 className="text-xl font-bold tracking-[0.4em] uppercase text-primary/80">Scanning Databases</h2>
                    <motion.p
                        className="text-muted-foreground text-sm font-mono tracking-widest"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        SEARCHING BREACH RECORDS...
                    </motion.p>
                    <div className="flex gap-2 justify-center">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-1.5 h-1.5 bg-primary/40 rounded-full"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error || !result) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                    <ShieldAlert className="w-8 h-8" />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">{error || "Critical Failure"}</h2>
                    <p className="text-muted-foreground">The analysis could not be completed.</p>
                </div>
                <Link href="/">
                    <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5">
                        <ArrowLeft className="w-4 h-4" /> Return to Terminal
                    </Button>
                </Link>
            </div>
        );
    }

    // USE BACKEND SCORE
    const riskScore = result.score;
    const riskLabel = result.level.toUpperCase();

    return (
        <div className="container mx-auto px-4 md:px-8 py-12 space-y-10 animate-in fade-in duration-700">
            {/* Top Navigation / Breadcrumb Area */}
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Neural Status :: Active</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        Identity Intelligence <span className="text-muted-foreground font-normal text-sm">/ {email}</span>
                    </h1>
                </div>
                <Link href="/">
                    <Button variant="ghost" size="sm" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="w-3 h-3 mr-2" /> New Scan
                    </Button>
                </Link>
            </div>

            {/* Exposure Details Modal */}
            <AnimatePresence>
                {selectedExposure && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedExposure(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#0A0C10] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Exposure Source</div>
                                        <h2 className="text-2xl font-bold text-foreground">{selectedExposure.source}</h2>
                                    </div>
                                    <div className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                                        selectedExposure.severity === "Critical" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                            selectedExposure.severity === "High" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                                                "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                    )}>
                                        {selectedExposure.severity}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                            <Database className="w-3 h-3" /> Compromised Data
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedExposure.dataClasses.map((dc, i) => (
                                                <span key={i} className="px-2 py-1 rounded bg-black/40 border border-white/10 text-xs font-mono text-primary/90">
                                                    {dc}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Type</div>
                                            <div className="text-sm font-semibold">{selectedExposure.type}</div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Date</div>
                                            <div className="text-sm font-mono text-muted-foreground">{selectedExposure.date}</div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Intelligence Summary</div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {selectedExposure.details}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <Button onClick={() => setSelectedExposure(null)} variant="outline" className="border-white/10 hover:bg-white/5">
                                        Close Details
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Visual Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Risk Characterization (4 Cols) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-card p-8 rounded-3xl border border-white/10 bg-white/[0.02] flex flex-col items-center justify-center space-y-6">
                        <div className="text-center space-y-1">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Overall Security Index</span>
                            <h2 className="text-lg font-bold">Threat Assessment</h2>
                        </div>
                        <RiskGauge value={riskScore} label={riskLabel} />
                        <div className="w-full h-px bg-white/5" />
                        <p className="text-center text-xs text-muted-foreground leading-relaxed px-4">
                            Based on correlated data from {result.details.stats.successProviders.length} global intelligence nodes.
                        </p>
                    </div>

                    {/* Summary Stats Grid */}
                    <div className="grid grid-cols-1 gap-4">
                        {[
                            { label: "Data Breaches", value: result.details.breaches, icon: Database, color: "text-red-500" },
                            { label: "Exposures", value: result.details.exposures.length, icon: Lock, color: "text-orange-500" }
                        ].map((stat, i) => (
                            <div key={i} className="glass-card p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                                <div className="flex items-center gap-4">
                                    <div className={cn("p-2.5 rounded-xl bg-background border border-white/5", stat.color)}>
                                        <stat.icon className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold tabular-nums">{stat.value}</div>
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Intelligence Detail (8 Cols) */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Exposure Directory */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-orange-500" /> Intelligence Feed
                            </h3>
                            <span className="text-[10px] text-muted-foreground">Found {result.details.exposures.length} distinct records</span>
                        </div>

                        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {result.details.exposures.length > 0 ? (
                                result.details.exposures.map((exp, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        key={i}
                                        onClick={() => setSelectedExposure(exp)}
                                        className="group flex flex-col md:flex-row md:items-center justify-between p-4 glass-card rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer active:scale-[0.99]"
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-sm tracking-tight">{exp.source}</span>
                                                <span className={cn(
                                                    "text-[9px] font-black px-1.5 py-0.5 rounded border tracking-widest uppercase",
                                                    exp.severity === "Critical" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                                        exp.severity === "High" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                                                            "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                                )}>
                                                    {exp.severity}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {exp.dataClasses.map((dc, j) => (
                                                    <span key={j} className="text-[8px] font-bold text-muted-foreground/80 bg-white/5 px-2 py-0.5 rounded uppercase tracking-tighter">
                                                        {dc}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mt-4 md:mt-0 flex flex-col items-end gap-1">
                                            <div className="text-[10px] font-mono text-primary font-bold">{exp.type}</div>
                                            <div className="text-[9px] font-mono text-muted-foreground uppercase">{exp.date || 'DATELINE_REDACTED'}</div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="p-16 text-center glass-card rounded-3xl border border-white/5 bg-white/[0.01]">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                                    <h3 className="text-base font-bold">Safe Horizon</h3>
                                    <p className="text-muted-foreground text-xs max-w-xs mx-auto mt-2">No known exposures were identified on this identifier across premium intelligence nodes.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Integrated Map - Moved Inside this Column */}
                    <div className="glass-card rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden w-full">
                        <div className="px-6 py-4 flex items-center justify-between border-b border-white/5">
                            <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                <Globe className="w-4 h-4 text-primary" /> Origin Attribution Map
                            </h3>
                            <span className="text-[9px] font-mono text-muted-foreground uppercase">Live Trace</span>
                        </div>
                        <div className="h-[300px] relative">
                            <LocationMap locations={result.details.locations || []} />
                            <div className="absolute inset-0 pointer-events-none border-[12px] border-transparent shadow-[inset_0_0_80px_rgba(0,0,0,0.6)]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium CTA Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-10 rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-background to-background border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32" />
                <div className="space-y-3 z-10 text-center md:text-left">
                    <h3 className="text-2xl font-bold tracking-tight">Activate Persistent Protection</h3>
                    <p className="text-muted-foreground text-sm max-w-lg leading-relaxed">
                        Registered users unlock continuous identity surveillance. We monitor the dark web 24/7 and alert you the second your data appears in a new breach.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 z-10">
                    <Link href="/signup">
                        <Button className="font-bold px-10 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg shadow-primary/20">Create Secure Account</Button>
                    </Link>
                    <Link href="/about">
                        <Button variant="ghost" className="font-bold h-12 px-8 text-muted-foreground hover:text-foreground">Learn Methodology</Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

export default function AnalyzePage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#02040a]">
            {/* Fine Grid Background Overlay */}
            <div className="fixed inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50" />
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`, backgroundSize: '24px 24px' }}
            />

            <Navbar />
            <main className="flex-1 flex flex-col relative z-10">
                <Suspense fallback={
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                }>
                    <AnalyzeContent />
                </Suspense>
            </main>
        </div>
    );
}

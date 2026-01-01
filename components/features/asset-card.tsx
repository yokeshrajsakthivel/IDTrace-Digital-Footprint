"use client";

import { motion } from "framer-motion";
import { Shield, ShieldAlert, MoreVertical, RefreshCw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteMonitor, refreshMonitor } from "@/lib/actions/monitors";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AssetCardProps {
    id: string;
    type: "email" | "username";
    value: string;
    status: "clean" | "leaked" | "scanning";
    lastScan: string;
    leakCount?: number;
}

export function AssetCard({ id, type, value, status, lastScan, leakCount }: AssetCardProps) {
    const router = useRouter();

    useEffect(() => {
        if (status === "scanning") {
            const timer = setInterval(() => {
                if (document.visibilityState === "visible") {
                    router.refresh();
                }
            }, 5000); // 5 seconds is plenty
            return () => clearInterval(timer);
        }
    }, [status, router]);

    const handleDelete = async () => {
        if (confirm("Are you sure you want to stop monitoring this identifier?")) {
            await deleteMonitor(id);
        }
    };

    const handleRefresh = async () => {
        await refreshMonitor(id);
    };
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative glass-card p-6 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
                        status === "clean" ? "bg-emerald-500/10 text-emerald-500" :
                            status === "leaked" ? "bg-red-500/10 text-red-500" :
                                "bg-primary/10 text-primary"
                    )}>
                        {status === "clean" ? <Shield className="w-6 h-6" /> :
                            status === "leaked" ? <ShieldAlert className="w-6 h-6" /> :
                                <RefreshCw className="w-6 h-6 animate-spin" />}
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                            {type}
                        </p>
                        <h4 className="text-base font-bold tracking-tight truncate max-w-[180px]">
                            {value}
                        </h4>
                    </div>
                </div>
                <button className="p-1 hover:bg-white/5 rounded-lg text-muted-foreground transition-colors transition-opacity opacity-0 group-hover:opacity-100">
                    <MoreVertical className="w-4 h-4" />
                </button>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground font-mono uppercase">Last Check</p>
                    <p className="text-xs font-bold text-white/80">{lastScan}</p>
                </div>
                {status === "leaked" && (
                    <div className="text-right space-y-1">
                        <p className="text-[10px] text-red-500/60 font-mono uppercase">Issues</p>
                        <p className="text-xs font-black text-red-500">{leakCount} BREACHES</p>
                    </div>
                )}
                {status === "clean" && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase">Secure</span>
                    </div>
                )}
            </div>

            {/* Hover Actions */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-1 group-hover:translate-y-0 transition-transform">
                <button
                    onClick={handleRefresh}
                    className="p-2 bg-black/60 backdrop-blur-md hover:bg-white/10 rounded-xl text-primary transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                    onClick={handleDelete}
                    className="p-2 bg-black/60 backdrop-blur-md hover:bg-red-500/20 rounded-xl text-red-400 transition-colors"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        </motion.div>
    );
}

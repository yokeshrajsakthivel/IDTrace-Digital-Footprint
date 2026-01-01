import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/features/dashboard-shell";
import { RiskGauge } from "@/components/features/risk-gauge";
import { AssetCard } from "@/components/features/asset-card";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import {
    Activity,
    ArrowUpRight,
    ShieldCheck,
    AlertCircle,
    Plus,
    Clock,
    Zap
} from "lucide-react";
import Link from "next/link";

export default async function UserDashboard() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    // Fetch real data from database
    const monitors = await (db as any).monitor.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    });

    // Calculate real stats
    const activeMonitors = monitors.length;
    const totalBreaches = monitors.reduce((acc: number, m: any) => acc + (m.leakCount || 0), 0);

    // Simple risk score calculation for the dashboard
    // Base 100, -10 per breach, minimum 10
    const riskScore = Math.max(10, 100 - (totalBreaches * 10) - (monitors.some((m: any) => m.status === 'LEAKED') ? 15 : 0));
    const riskLabel = riskScore > 80 ? "Healthy" : riskScore > 50 ? "Caution" : "At Risk";

    return (
        <DashboardShell userName={session.user.name || "Agent"}>
            <div className="space-y-10 max-w-7xl mx-auto">
                {/* Hero / Overview Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Level Gauge */}
                    <div className="lg:col-span-4 glass-card p-8 rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform">
                            <ShieldCheck className="w-24 h-24 text-primary" />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground mb-8">Security Pulse</h3>
                        <RiskGauge value={riskScore} label={riskLabel} className="scale-110" />
                        <p className="mt-8 text-xs text-muted-foreground text-center leading-relaxed">
                            Your security profile is currently <span className="text-primary font-bold">{riskLabel}</span>.
                            {totalBreaches > 0 ? `${totalBreaches} leak(s) identified.` : "No active leaks detected."}
                        </p>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: "Active Monitors", value: activeMonitors, icon: Zap, color: "text-primary", desc: "Live surveillance active" },
                            { label: "Total Breaches", value: totalBreaches, icon: AlertCircle, color: "text-red-500", desc: "Across all identifiers" },
                            { label: "Resolved Issues", value: "0", icon: ShieldCheck, color: "text-emerald-500", desc: "Successfully protected" },
                            { label: "Account Health", value: `${riskScore}%`, icon: Activity, color: "text-blue-400", desc: "Overall integrity score" },
                        ].map((stat, i) => (
                            <div key={i} className="glass-card p-6 rounded-3xl border border-white/5 bg-white/[0.01] flex flex-col justify-between group hover:border-white/20 transition-all">
                                <div className="flex items-center justify-between">
                                    <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="mt-6">
                                    <p className="text-3xl font-black tracking-tighter">{stat.value}</p>
                                    <p className="text-xs font-bold text-white/60 mt-1 uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-[10px] text-muted-foreground mt-2">{stat.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Monitored Assets Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold tracking-tight">Monitored Assets</h3>
                            <p className="text-xs text-muted-foreground">Managing your digital identity pointers</p>
                        </div>
                        <Link href="/dashboard/user/monitors">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-black font-bold text-xs hover:scale-105 transition-transform">
                                <Plus className="w-4 h-4" /> Add Identifier
                            </button>
                        </Link>
                    </div>

                    {monitors.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {monitors.map((m: any) => (
                                <AssetCard
                                    key={m.id}
                                    id={m.id}
                                    type={m.type.toLowerCase() as "email" | "username"}
                                    value={m.value}
                                    status={m.status.toLowerCase() as "clean" | "leaked" | "scanning"}
                                    lastScan={m.lastChecked ? new Date(m.lastChecked).toLocaleString() : "Never"}
                                    leakCount={m.leakCount}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 glass-card rounded-[2rem] border border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center space-y-4">
                            <ShieldCheck className="w-12 h-12 text-muted-foreground/20" />
                            <p className="text-sm text-muted-foreground max-w-xs">
                                You are not monitoring any identifiers yet. Add your email to start tracking exposures.
                            </p>
                            <Link href="/dashboard/user/monitors">
                                <button className="text-xs font-bold text-primary hover:underline">Setup first monitor</button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Recent Activity Section */}
                <div className="glass-card rounded-[2rem] border border-white/5 bg-white/[0.01] overflow-hidden">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-lg font-bold flex items-center gap-3">
                            <Clock className="w-5 h-5 text-primary" /> Activity Stream
                        </h3>
                        <button className="text-xs font-bold text-primary hover:underline">View Historical Logs</button>
                    </div>
                    <div className="divide-y divide-white/5">
                        {[
                            { event: "New data leak detected", target: "agent_zero", time: "5 minutes ago", type: "alert" },
                            { event: "Automated scan completed", target: "Personal Email", time: "2 hours ago", type: "info" },
                            { event: "Vault password rotated", target: "System", time: "1 day ago", type: "security" },
                            { event: "New device login", target: "Windows - Mumbai, IN", time: "2 days ago", type: "alert" },
                        ].map((item, i) => (
                            <div key={i} className="p-6 hover:bg-white/[0.02] transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        item.type === 'alert' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                                            item.type === 'security' ? 'bg-emerald-500' : 'bg-primary'
                                    )} />
                                    <div>
                                        <p className="text-sm font-bold group-hover:text-primary transition-colors">{item.event}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">{item.target}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-mono text-muted-foreground">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}

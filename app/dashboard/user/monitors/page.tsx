import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/features/dashboard-shell";
import { AssetCard } from "@/components/features/asset-card";
import { AddMonitorForm } from "@/components/features/add-monitor-form";
import { db } from "@/lib/db";
import { ShieldCheck } from "lucide-react";

export default async function MonitorsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const monitors = await (db as any).monitor.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <DashboardShell userName={session.user.name || "Agent"}>
            <div className="space-y-6 max-w-7xl mx-auto">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight">Active Monitors</h2>
                        <p className="text-muted-foreground text-sm">Real-time surveillance modules for your digital assets.</p>
                    </div>
                    <AddMonitorForm />
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
                    <div className="glass-card p-12 rounded-[2rem] border border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center space-y-4 col-span-full">
                        <ShieldCheck className="w-16 h-16 text-muted-foreground/20" />
                        <h3 className="text-lg font-bold">No Active Monitors</h3>
                        <p className="max-w-xs text-sm text-muted-foreground">
                            You are not monitoring any identifiers. Add an email or username to start tracking exposures.
                        </p>
                        <div className="pt-4">
                            <AddMonitorForm />
                        </div>
                    </div>
                )}
            </div>
        </DashboardShell>
    );
}

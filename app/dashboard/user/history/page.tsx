import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/features/dashboard-shell";
import { History } from "lucide-react";

export default async function HistoryPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    return (
        <DashboardShell userName={session.user.name || "Agent"}>
            <div className="space-y-6 max-w-7xl mx-auto">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Scan History</h2>
                    <p className="text-muted-foreground text-sm">Chronological record of all intelligence gathering operations.</p>
                </div>

                <div className="glass-card rounded-[2rem] border border-white/5 bg-white/[0.01] overflow-hidden opacity-40">
                    <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
                        <History className="w-16 h-16 text-muted-foreground/20" />
                        <h3 className="text-lg font-bold">No Past Operations</h3>
                        <p className="max-w-xs text-sm text-muted-foreground">
                            When you perform scans or automated checks, your history will appear here.
                        </p>
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}

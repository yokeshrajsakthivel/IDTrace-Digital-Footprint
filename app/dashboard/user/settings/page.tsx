import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/features/dashboard-shell";
import { Settings, User, Bell, Shield, Key } from "lucide-react";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const settingsSections = [
        { name: "Account Profile", icon: User, desc: "Personal information and identity settings" },
        { name: "Notifications", icon: Bell, desc: "Manage alert preferences and frequencies" },
        { name: "Privacy & Privacy", icon: Shield, desc: "Security protocols and data sharing settings" },
        { name: "API Access", icon: Key, desc: "Developer tools and integration keys" },
    ];

    return (
        <DashboardShell userName={session.user.name || "Agent"}>
            <div className="space-y-8 max-w-4xl mx-auto">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Console Settings</h2>
                    <p className="text-muted-foreground text-sm">Configure your surveillance workspace preferences.</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {settingsSections.map((section, i) => (
                        <div key={i} className="glass-card p-6 rounded-3xl border border-white/5 bg-white/[0.01] flex items-center justify-between group hover:bg-white/[0.03] transition-all cursor-pointer">
                            <div className="flex items-center gap-6">
                                <div className="p-4 rounded-2xl bg-white/5 text-muted-foreground group-hover:text-primary transition-colors">
                                    <section.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-base">{section.name}</h4>
                                    <p className="text-xs text-muted-foreground mt-0.5">{section.desc}</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 rounded-xl bg-white/5 text-xs font-bold hover:bg-white/10 transition-colors">Configure</button>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardShell>
    );
}

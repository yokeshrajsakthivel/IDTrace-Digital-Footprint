"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    ShieldCheck,
    History,
    Settings,
    LogOut,
    User,
    Menu,
    X,
    Bell,
    Search
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";

interface DashboardShellProps {
    children: React.ReactNode;
    userName: string;
}

const menuItems = [
    { name: "Overview", icon: LayoutDashboard, href: "/dashboard/user" },
    { name: "Monitors", icon: ShieldCheck, href: "/dashboard/user/monitors" },
    { name: "History", icon: History, href: "/dashboard/user/history" },
    { name: "Settings", icon: Settings, href: "/dashboard/user/settings" },
];

export function DashboardShell({ children, userName }: DashboardShellProps) {
    const pathname = usePathname();
    const [isSidebarOpen, setSidebarOpen] = React.useState(true);

    return (
        <div className="flex min-h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 260 : 80 }}
                className="relative z-50 flex flex-col border-r border-white/5 bg-black/40 backdrop-blur-xl"
            >
                <div className="p-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-black" />
                    </div>
                    {isSidebarOpen && (
                        <span className="font-black tracking-tighter text-xl italic uppercase">IDTrace</span>
                    )}
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.name} href={item.href}>
                                <div className={cn(
                                    "group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 relative",
                                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-white"
                                )}>
                                    <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-white")} />
                                    {isSidebarOpen && <span className="font-bold text-sm">{item.name}</span>}
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebar-accent"
                                            className="absolute left-0 w-1 h-6 bg-primary rounded-full"
                                        />
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5 space-y-2">
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        {isSidebarOpen && <span className="font-bold text-sm">Log out</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb),0.05),transparent_40%)]">
                {/* Header */}
                <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-sm sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <div className="relative group hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search archives..."
                                className="bg-white/5 border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
                        </button>
                        <div className="flex items-center gap-3 border-l border-white/10 pl-6 cursor-pointer group">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold truncate max-w-[120px]">{userName}</p>
                                <p className="text-[10px] text-primary uppercase font-black tracking-tighter">Gold Tier</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                                <User className="w-6 h-6 text-black" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

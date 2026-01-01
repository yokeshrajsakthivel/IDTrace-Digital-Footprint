"use client";

import React from "react";
import { Plus, Loader2 } from "lucide-react";
import { addMonitor } from "@/lib/actions/monitors";

export function AddMonitorForm() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [type, setType] = React.useState<"EMAIL" | "USERNAME">("EMAIL");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!value) return;

        setIsLoading(true);
        try {
            await addMonitor(value, type);
            setIsOpen(false);
            setValue("");
        } catch (error) {
            console.error(error);
            alert("Failed to add monitor");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-black font-bold text-xs hover:scale-105 transition-transform"
            >
                <Plus className="w-4 h-4" /> New Monitor
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="glass-card p-8 rounded-[2rem] border border-white/10 bg-black w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
                <h3 className="text-xl font-bold mb-6">Add Surveillance Target</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Identifier Type</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setType("EMAIL")}
                                className={`py-2 rounded-xl border text-xs font-bold transition-all ${type === "EMAIL" ? "bg-primary text-black border-primary" : "border-white/5 hover:bg-white/5 text-muted-foreground"}`}
                            >
                                Email Address
                            </button>
                            <button
                                type="button"
                                onClick={() => setType("USERNAME")}
                                className={`py-2 rounded-xl border text-xs font-bold transition-all ${type === "USERNAME" ? "bg-primary text-black border-primary" : "border-white/5 hover:bg-white/5 text-muted-foreground"}`}
                            >
                                Username
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Target Information</label>
                        <input
                            type="text"
                            required
                            placeholder={type === "EMAIL" ? "target@example.com" : "username_profile"}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 pt-6">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-bold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-3 rounded-xl bg-primary text-black text-sm font-bold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Initiate Tracking"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

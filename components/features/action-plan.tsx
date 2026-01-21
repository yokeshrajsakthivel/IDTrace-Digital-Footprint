"use client";

import { useState } from "react";
import { generateActionPlan } from "@/app/actions/generate-plan";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, ListTodo, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ActionPlanProps {
    monitors: { value: string; type: string }[];
}

interface PlanItem {
    title: string;
    description: string;
    priority: "High" | "Medium" | "Low";
    steps: string[];
    service?: string;
}

export function ActionPlan({ monitors }: ActionPlanProps) {
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState<PlanItem[] | null>(null);
    const [expandedItem, setExpandedItem] = useState<number | null>(null);
    const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

    const handleGenerate = async () => {
        setLoading(true);
        try {
            // 1. Gather breach data for all monitors
            const allBreaches: any[] = [];

            // Limit to first 3 monitors to avoid rate limits/timeouts
            const targets = monitors.slice(0, 3);

            for (const m of targets) {
                // Only scan emails for now as the API expects email
                if (m.type !== 'email') continue;

                const res = await fetch(`/api/scan?email=${encodeURIComponent(m.value)}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.details?.exposures) {
                        allBreaches.push(...data.details.exposures);
                    }
                }
            }

            if (allBreaches.length === 0) {
                // No breaches found, mock a secure plan or just message
                setPlan([{
                    title: "Maintain Security Hygiene",
                    description: "Great news! No major breaches were found for your accounts. However, it's always good to stay vigilant.",
                    priority: "Low",
                    steps: [
                        "Enable 2FA on all important accounts",
                        "Use a password manager",
                        "Review privacy settings annually"
                    ]
                }]);
                setLoading(false);
                return;
            }

            // 2. Generate Plan using AI
            const uniqueBreaches = Array.from(new Set(allBreaches.map(b => b.source)))
                .map(source => allBreaches.find(b => b.source === source));

            const result = await generateActionPlan(uniqueBreaches);
            if (result.success && result.plan) {
                setPlan(result.plan);
            }
        } catch (error) {
            console.error("Failed to generate plan", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStep = (id: string) => {
        setCompletedSteps(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="glass-card rounded-[2rem] border border-white/5 bg-white/[0.01] overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-3">
                        <ListTodo className="w-5 h-5 text-primary" /> Security Action Plan
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">AI-generated recovery steps tailored to your breaches</p>
                </div>
                {!plan && (
                    <Button
                        onClick={handleGenerate}
                        disabled={loading || monitors.length === 0}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ListTodo className="w-4 h-4 mr-2" />}
                        {loading ? "Analyzing..." : "Generate Plan"}
                    </Button>
                )}
            </div>

            <div className="p-8">
                {!plan ? (
                    <div className="text-center py-10 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 mx-auto flex items-center justify-center">
                            <ListTodo className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                            Click above to scan your accounts and generate a step-by-step security checklist using Gemini AI.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {plan.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={cn(
                                    "border rounded-2xl overflow-hidden transition-all",
                                    item.priority === 'High' ? "border-red-500/20 bg-red-500/5" :
                                        item.priority === 'Medium' ? "border-orange-500/20 bg-orange-500/5" :
                                            "border-white/10 bg-white/5"
                                )}
                            >
                                <div
                                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/5"
                                    onClick={() => setExpandedItem(expandedItem === i ? null : i)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            item.priority === 'High' ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" :
                                                item.priority === 'Medium' ? "bg-orange-500" : "bg-emerald-500"
                                        )} />
                                        <div>
                                            <h4 className="font-bold text-sm">{item.title}</h4>
                                            <p className="text-xs text-muted-foreground">{item.description}</p>
                                        </div>
                                    </div>
                                    {expandedItem === i ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                </div>

                                <AnimatePresence>
                                    {expandedItem === i && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: "auto" }}
                                            exit={{ height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-5 pt-0 border-t border-white/5 space-y-3">
                                                {item.steps.map((step, sIdx) => {
                                                    const stepId = `${i}-${sIdx}`;
                                                    const isCompleted = completedSteps[stepId];
                                                    return (
                                                        <div
                                                            key={sIdx}
                                                            className="flex items-start gap-3 p-3 rounded-xl bg-black/20 hover:bg-black/40 transition-colors cursor-pointer"
                                                            onClick={() => toggleStep(stepId)}
                                                        >
                                                            <div className={cn(
                                                                "w-5 h-5 rounded border flex items-center justify-center mt-0.5 transition-colors",
                                                                isCompleted ? "bg-primary border-primary text-black" : "border-white/20 hover:border-primary/50"
                                                            )}>
                                                                {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                                                            </div>
                                                            <span className={cn(
                                                                "text-sm leading-relaxed transition-opacity",
                                                                isCompleted ? "text-muted-foreground line-through opacity-50" : "text-foreground"
                                                            )}>
                                                                {step}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

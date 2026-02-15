"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyEmail } from "@/app/actions/reset-password";
import { Shield } from "lucide-react";
import { FingerprintIcon } from "@/components/icons";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;

        try {
            const res = await verifyEmail(email);
            if (res.error) {
                setError(res.error);
            } else {
                router.push(`/reset-password?email=${encodeURIComponent(email)}`);
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            <Navbar />

            <main className="flex-1 flex items-center justify-center p-6 pt-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-[400px] space-y-8"
                >
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                            <FingerprintIcon className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Forgot Password</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your email to reset your password
                        </p>
                    </div>

                    <div className="glass-card p-8 rounded-2xl shadow-sm border-border/50">
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="h-10 bg-background/50"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    autoCorrect="off"
                                    disabled={loading}
                                    required
                                />
                            </div>

                            {error && (
                                <div className="text-sm text-red-500 font-medium text-center">
                                    {error}
                                </div>
                            )}

                            <Button disabled={loading} className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md shadow-sm group">
                                {loading ? "Verifying..." : "Continue"}
                            </Button>
                        </form>
                    </div>

                    <div className="flex justify-center gap-6 text-xs text-muted-foreground opacity-60">
                        <div className="flex items-center gap-2">
                            <Shield className="w-3 h-3" />
                            <span>Secure Connection</span>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}

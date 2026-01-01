"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { motion } from "framer-motion";
import Link from "next/link";
import { FingerprintIcon } from "@/components/icons";
import { Shield, ArrowRight } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid credentials");
            } else {
                router.push("/dashboard");
                router.refresh();
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
                    {/* Header Branding */}
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                            <FingerprintIcon className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome back</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    {/* Login Form */}
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
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                    <Link href="#" className="text-sm font-medium text-primary hover:underline underline-offset-4">Forgot password?</Link>
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    className="h-10 bg-background/50"
                                    disabled={loading}
                                />
                            </div>

                            {error && (
                                <div className="text-sm text-red-500 font-medium text-center">
                                    {error}
                                </div>
                            )}

                            <Button disabled={loading} className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md shadow-sm group">
                                {loading ? "Signing in..." : "Sign in"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-muted-foreground">Don&apos;t have an account? </span>
                            <Link href="/signup" className="font-medium text-primary hover:underline underline-offset-4">
                                Sign up
                            </Link>
                        </div>
                    </div>

                    {/* Simple Footer */}
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

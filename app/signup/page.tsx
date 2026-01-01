"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { motion } from "framer-motion";
import Link from "next/link";
import { FingerprintIcon } from "@/components/icons";
import { Shield, Zap } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import { signIn } from "next-auth/react";

export default function SignupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const firstName = formData.get("firstName") as string;
        const lastName = formData.get("lastName") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const name = `${firstName} ${lastName}`;

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (!res.ok) {
                const text = await res.text();
                setError(text || "Failed to create account");
                return;
            }

            // Redirect to login page instead of auto-login
            router.push("/login");
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
                    className="w-full max-w-[450px] space-y-8"
                >
                    {/* Header Branding */}
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                            <FingerprintIcon className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Create an account</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your email below to create your account
                        </p>
                    </div>

                    {/* Registration Form */}
                    <div className="glass-card p-8 rounded-2xl shadow-sm border-border/50">
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-sm font-medium">First name</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        placeholder="Yokesh"
                                        className="h-10 bg-background/50"
                                        disabled={loading}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-sm font-medium">Last name</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        placeholder="Raj"
                                        className="h-10 bg-background/50"
                                        disabled={loading}
                                        required
                                    />
                                </div>
                            </div>

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

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    className="h-10 bg-background/50"
                                    disabled={loading}
                                    required
                                />
                            </div>

                            {error && (
                                <div className="text-sm text-red-500 font-medium text-center">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4 pt-2">
                                <Button disabled={loading} className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md shadow-sm">
                                    {loading ? "Creating account..." : "Create account"}
                                </Button>
                                <p className="text-xs text-muted-foreground text-center px-6">
                                    By clicking continue, you agree to our <Link href="#" className="underline underline-offset-4 hover:text-primary">Terms of Service</Link> and <Link href="#" className="underline underline-offset-4 hover:text-primary">Privacy Policy</Link>.
                                </p>
                            </div>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-muted-foreground">Already have an account? </span>
                            <Link href="/login" className="font-medium text-primary hover:underline underline-offset-4">
                                Log in
                            </Link>
                        </div>
                    </div>

                    {/* Simple Footer */}
                    <div className="flex justify-center gap-6 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Shield className="w-3 h-3" />
                            <span>Secure & Encrypted</span>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}

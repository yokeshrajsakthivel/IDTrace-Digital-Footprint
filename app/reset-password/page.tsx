"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { motion } from "framer-motion";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { updatePassword } from "@/app/actions/reset-password";
import { Shield } from "lucide-react";
import { FingerprintIcon } from "@/components/icons";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!email) {
            setError("Missing email address");
            return;
        }

        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const res = await updatePassword(email, password);
            if (res.error) {
                setError(res.error);
            } else {
                router.push("/login?success=password_reset");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (!email) {
        return (
            <div className="text-center text-red-500">
                Invalid request. Missing email address.
            </div>
        );
    }

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">New Password</Label>
                <PasswordInput
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    className="h-10 bg-background/50"
                    disabled={loading}
                    required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
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

            <Button disabled={loading} className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md shadow-sm group">
                {loading ? "Resetting..." : "Reset Password"}
            </Button>
        </form>
    );
}

export default function ResetPasswordPage() {
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
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Reset Password</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your new password
                        </p>
                    </div>

                    <div className="glass-card p-8 rounded-2xl shadow-sm border-border/50">
                        <Suspense fallback={<div>Loading...</div>}>
                            <ResetPasswordForm />
                        </Suspense>
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

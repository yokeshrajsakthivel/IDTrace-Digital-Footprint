"use client";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Assuming Textarea exists or using Input as fallback
import { motion } from "framer-motion";
import { Mail, MapPin, MessageSquare } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            <Navbar />

            <main className="flex-1 pt-24 pb-12 flex items-center justify-center">
                <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <h1 className="text-4xl font-semibold tracking-tight">Get in touch</h1>
                        <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                            Have questions about our enterprise solutions or need support? Our security team is ready to assist you.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium">Email us</div>
                                    <div className="text-sm text-muted-foreground">security@idtrace.com</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium">Live Chat</div>
                                    <div className="text-sm text-muted-foreground">Available Mon-Fri, 9am-5pm GMT</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium">Headquarters</div>
                                    <div className="text-sm text-muted-foreground">TamilNadu, IN</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-8 rounded-2xl border-border/50 shadow-sm"
                    >
                        <form className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first-name" className="text-sm font-medium">First name</Label>
                                    <Input id="first-name" placeholder="Yokesh" className="bg-background/50" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last-name" className="text-sm font-medium">Last name</Label>
                                    <Input id="last-name" placeholder="Raj" className="bg-background/50" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Work Email</Label>
                                <Input id="email" type="email" placeholder="name@example.com" className="bg-background/50" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                                <textarea
                                    id="message"
                                    className="flex w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] resize-none"
                                    placeholder="How can we help you?"
                                />
                            </div>
                            <Button className="w-full bg-primary text-primary-foreground font-medium">
                                Send Message
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}

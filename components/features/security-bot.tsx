"use client";

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, X, Send, Shield, User, Loader2, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function SecurityBot() {
    const [isOpen, setIsOpen] = useState(false);
    // Explicitly cast to any to bypass type definition issues in @ai-sdk/react v3
    // Explicitly cast to any to bypass type definition issues in @ai-sdk/react v3
    const chatHelpers = useChat() as any;
    const { messages, status, sendMessage } = chatHelpers;
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Derive isLoading from status
    const isLoading = status === "submitted" || status === "streaming";

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Optimistically add user message and trigger stream
        await sendMessage({ role: 'user', content: input });
        setInput("");
    };

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="pointer-events-auto mb-4 w-[350px] sm:w-[400px] h-[500px] bg-[#0A0C10] border border-primary/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                                    <Bot className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">IDTrace Sentinel</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] text-emerald-500 uppercase tracking-wider font-semibold">Online</span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-muted-foreground hover:text-white">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                            {messages.length === 0 && (
                                <div className="text-center space-y-3 mt-10 opacity-60">
                                    <Shield className="w-10 h-10 mx-auto text-primary/50" />
                                    <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
                                        Hello! I'm your virtual security expert. Ask me about your digital footprint or how to secure your accounts.
                                    </p>
                                </div>
                            )}

                            {messages.map((m: any) => (
                                <div
                                    key={m.id}
                                    className={cn(
                                        "flex gap-3 text-sm",
                                        m.role === 'user' ? "flex-row-reverse" : "flex-row"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                                        m.role === 'user' ? "bg-white/10 border-white/20" : "bg-primary/10 border-primary/20"
                                    )}>
                                        {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-primary" />}
                                    </div>
                                    <div className={cn(
                                        "p-3 rounded-2xl max-w-[80%]",
                                        m.role === 'user'
                                            ? "bg-primary text-primary-foreground rounded-tr-none"
                                            : "bg-white/10 text-foreground rounded-tl-none border border-white/5"
                                    )}>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                    </div>
                                    <div className="p-3 rounded-2xl bg-white/10 border border-white/5 rounded-tl-none flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
                                        <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSubmit} className="p-4 pt-2 bg-[#0A0C10] border-t border-white/10">
                            <div className="flex gap-2 relative">
                                <Input
                                    value={input}
                                    onChange={handleInputChange}
                                    placeholder="Ask about cybersecurity..."
                                    className="pr-10 bg-white/5 border-white/10 focus-visible:ring-primary/50"
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={isLoading || !input.trim()}
                                    className="absolute right-1 top-1 h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    <Send className="w-3 h-3" />
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto shadow-2xl shadow-primary/20 h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-4 border-[#02040a] relative group"
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <>
                        <MessageSquare className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#02040a]" />
                    </>
                )}
            </motion.button>
        </div>
    );
}

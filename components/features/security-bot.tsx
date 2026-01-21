"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, X, Send, Shield, User, Loader2, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Simple message type for our manual implementation
type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
};

export function SecurityBot() {
    const [isOpen, setIsOpen] = useState(false);

    // SIMPLE METHOD: Manage state manually without useChat hook
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        };

        // Optimistically add user message
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // SIMPLE METHOD: Standard fetch request
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage] // send context
                })
            });

            if (!response.ok) throw new Error("Network response was not ok");
            if (!response.body) throw new Error("No response body");

            // Prepare placeholder for AI response
            const aiMessageId = (Date.now() + 1).toString();
            setMessages(prev => [...prev, { id: aiMessageId, role: 'assistant', content: "" }]);

            // Create a reader to read the stream
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            let accumulatedContent = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                accumulatedContent += chunk;

                // Update the last message (AI's message) with new content
                setMessages(prev => prev.map(msg =>
                    msg.id === aiMessageId ? { ...msg, content: accumulatedContent } : msg
                ));
            }

        } catch (error) {
            console.error("Chat Error:", error);
            // Optional: Add error message to chat
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: "Sorry, I'm having trouble connecting right now. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
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

                            {messages.map((m) => (
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

            {/* Animated Robot Launcher */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto relative group flex items-center justify-center w-16 h-16"
            >
                {/* Radar Ripple Effect */}
                {!isOpen && (
                    <>
                        <motion.div
                            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                            className="absolute inset-0 rounded-full bg-primary/20 border border-primary/30 z-0"
                        />
                        <motion.div
                            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                            className="absolute inset-0 rounded-full bg-primary/20 z-0"
                        />
                    </>
                )}

                {/* Core Container */}
                <div className={cn(
                    "relative z-10 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_30px_rgba(var(--primary),0.5)]",
                    isOpen
                        ? "bg-[#0A0C10] border-2 border-white/20 rotate-90"
                        : "bg-primary border-2 border-white/20 rotate-0"
                )}>
                    {/* Inner Tech Ring (Decorative) */}
                    <div className="absolute inset-1 rounded-full border border-dashed border-white/30 animate-[spin_10s_linear_infinite]" />

                    {isOpen ? (
                        <X className="w-6 h-6 text-white" />
                    ) : (
                        <Bot className="w-7 h-7 text-primary-foreground fill-white" />
                    )}

                    {/* Online Dot */}
                    {!isOpen && (
                        <span className="absolute top-0 right-0 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#02040a]"></span>
                        </span>
                    )}
                </div>
            </motion.button>
        </div>
    );
}

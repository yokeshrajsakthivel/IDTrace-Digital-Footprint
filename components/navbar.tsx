"use client";

import Link from "next/link"
import { ModeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import { FingerprintIcon } from "@/components/icons"
import { motion } from "framer-motion"
import { useSession, signOut } from "next-auth/react"
import { LogOut, User } from "lucide-react"

export function Navbar() {
    const { data: session, status } = useSession();

    return (
        <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl transition-all duration-500">
            <div className="container mx-auto h-16 flex items-center justify-between px-6">

                {/* Precision Branding */}
                <Link href="/" className="flex items-center space-x-3 group">
                    <div className="relative">
                        <FingerprintIcon className="w-8 h-8 text-primary group-hover:scale-105 transition-transform duration-500" />
                        <motion.div
                            animate={{ opacity: [0.2, 0.4, 0.2] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-primary/20 blur-lg rounded-full -z-10"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold tracking-tight text-foreground">
                            ID<span className="text-primary">Trace</span>
                        </span>
                        <span className="text-xs text-muted-foreground">Digital Intelligence</span>
                    </div>
                </Link>

                {/* Standard Professional Nav */}
                <nav className="hidden lg:flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Home
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        About
                    </Link>
                    <Link href="/#services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Services
                    </Link>
                    <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Contact
                    </Link>

                    <div className="flex items-center gap-4 border-l border-border pl-8 ml-2">
                        <ModeToggle />

                        {status === "authenticated" ? (
                            <>
                                <Link href="/dashboard">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-sm font-medium text-muted-foreground hover:text-foreground"
                                    >
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="text-sm font-medium text-muted-foreground hover:text-red-500 transition-colors"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Log out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-sm font-medium text-muted-foreground hover:text-foreground"
                                    >
                                        Log in
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-5 rounded-full shadow-sm"
                                    >
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* Mobile Controls */}
                <div className="lg:hidden flex items-center gap-4">
                    <ModeToggle />
                    <Button variant="ghost" size="icon">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                    </Button>
                </div>
            </div>
        </header>
    )
}

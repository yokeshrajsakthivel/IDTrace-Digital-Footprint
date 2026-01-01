"use client";

import { Navbar } from "@/components/navbar";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            <Navbar />

            <main className="flex-1 pt-32 pb-20">
                <article className="container mx-auto px-6 max-w-3xl prose prose-neutral dark:prose-invert">
                    <h1>Privacy Policy</h1>
                    <p className="lead text-lg text-muted-foreground">Last updated: December 30, 2025</p>

                    <h3>1. Introduction</h3>
                    <p>
                        IDTrace ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
                    </p>

                    <h3>2. Data Minimize Principle</h3>
                    <p>
                        We operate on a strict data minimization principle. Unlike other data brokers or scanners:
                    </p>
                    <ul>
                        <li>We <strong>do not store</strong> the search queries you enter (emails, usernames).</li>
                        <li>We <strong>do not log</strong> your IP address associated with specific searches.</li>
                        <li>All analysis is performed in real-time and discarded immediately after the session ends.</li>
                    </ul>

                    <h3>3. Information We Collect</h3>
                    <p>
                        If you create an account, we store only the minimal information required to provide the service:
                    </p>
                    <ul>
                        <li>Account credentials (hashed passwords).</li>
                        <li>Contact email for alerts (if opted in).</li>
                        <li>Subscription status.</li>
                    </ul>

                    <h3>4. Contact Us</h3>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at <a href="/contact">privacy@idtrace.com</a>.
                    </p>
                </article>
            </main>
        </div>
    );
}

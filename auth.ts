import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { authConfig } from "./auth.config";
import { db } from "./lib/db";
import bcrypt from "bcryptjs";

import { cookies } from "next/headers";

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(db) as any, // Cast to any to resolve version mismatch between @auth/core and next-auth beta
    session: { strategy: "jwt", maxAge: 30 * 60 }, // 30 minutes session expiry
    callbacks: {
        async signIn({ user, account }) {
            // Allow OAuth logic check
            if (account?.provider === "google") {
                const cookieStore = await cookies();
                const intent = cookieStore.get("auth_intent")?.value;

                console.log(`[AUTH] Checking Google Sign-In. Email: ${user.email}, Intent: ${intent}`);

                // If intent is 'login', USER MUST EXIST.
                if (intent === "login") {
                    const existingUser = await db.user.findUnique({ where: { email: user.email! } });
                    if (!existingUser) {
                        console.log("[AUTH] Login blocked: User does not exist and intent is 'login'.");
                        // Redirect to signup page with a friendly error code
                        return "/signup?error=account_not_found";
                    }
                }
                // If intent is 'signup', we allow creation (standard behavior)
            }
            return true;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (token.role && session.user) {
                // @ts-ignore
                session.user.role = token.role;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        // IMPORTANT: Merge with authConfig callbacks if needed, or re-declare here as `...authConfig` handles pages only usually
    },
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            allowDangerousEmailAccountLinking: true, // Allow linking if same email exists (optional but smooths UX)
        }),
        Credentials({
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                const { email, password } = credentials;

                console.log("Attempting login for:", email);
                const user = await db.user.findUnique({ where: { email: String(email) } });

                if (!user || !user.password) { // Check if user exists AND has password (if Google user, might be null)
                    console.log("User not found or no password set (OAuth user)");
                    return null;
                }

                console.log("User found, Verifying password...");
                const passwordsMatch = await bcrypt.compare(String(password), user.password);

                if (passwordsMatch) {
                    console.log("Password verified successfully");
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };
                }

                console.log("Password mismatch");
                return null;
            },
        }),
    ],
});

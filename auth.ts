import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { db } from "./lib/db";
import bcrypt from "bcryptjs";

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                const { email, password } = credentials;

                console.log("Attempting login for:", email);
                const user = await db.user.findUnique({ where: { email: String(email) } });

                if (!user) {
                    console.log("User not found in DB");
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

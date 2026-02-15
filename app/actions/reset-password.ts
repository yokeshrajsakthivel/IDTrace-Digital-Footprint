"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function verifyEmail(email: string) {
    if (!email) {
        return { error: "Email is required" };
    }

    try {
        const user = await db.user.findUnique({
            where: { email },
        });

        if (!user) {
            return { error: "User not found" };
        }

        return { success: true };
    } catch (error) {
        return { error: "Something went wrong" };
    }
}

export async function updatePassword(email: string, password: string) {
    if (!email || !password) {
        return { error: "Email and password are required" };
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.user.update({
            where: { email },
            data: { password: hashedPassword },
        });

        return { success: true };
    } catch (error) {
        return { error: "Failed to update password" };
    }
}

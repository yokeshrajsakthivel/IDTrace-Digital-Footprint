import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return new NextResponse("Missing fields", { status: 400 });
        }

        const existingUser = await db.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return new NextResponse("Email already exists", { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // First user is ADMIN, others are USER (simple logic for now, or just default USER)
        // Let's stick to default USER. Manual DB edit for Admin for security.
        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "USER"
            }
        });

        return NextResponse.json(user);

    } catch (error) {
        console.error("SIGNUP_ERROR", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const users = await db.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true
            }
        });
        return NextResponse.json(users);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

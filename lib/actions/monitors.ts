"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { processMonitor } from "@/lib/services/monitor-scanner";

export async function addMonitor(value: string, type: "EMAIL" | "USERNAME") {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const monitor = await (db as any).monitor.create({
        data: {
            userId: session.user.id,
            value,
            type,
            status: "SCANNING",
        }
    });

    // For the demo, we'll process it immediately.
    // In production, this would be a background job.
    processMonitor(monitor.id).catch(console.error);

    revalidatePath("/dashboard/user");
}

export async function deleteMonitor(id: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await (db as any).monitor.delete({
        where: {
            id,
            userId: session.user.id
        }
    });

    revalidatePath("/dashboard/user");
}

export async function refreshMonitor(id: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await (db as any).monitor.update({
        where: { id, userId: session.user.id },
        data: { status: "SCANNING" }
    });

    // Trigger fresh scan
    processMonitor(id).catch(console.error);

    revalidatePath("/dashboard/user");
}

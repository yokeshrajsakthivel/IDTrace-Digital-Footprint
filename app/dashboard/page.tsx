import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role === "ADMIN") {
        redirect("/dashboard/admin");
    } else {
        redirect("/dashboard/user");
    }
}

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";

export default async function AdminDashboard() {
    const session = await auth();

    if (session?.user?.role !== "ADMIN") {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="container mx-auto p-8 pt-24">
                <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 mb-6">
                    <p>Welcome, Admin <strong>{session.user.name}</strong></p>
                    <p className="text-sm text-muted-foreground mt-2">ID: {session.user.id}</p>
                    <p className="text-sm text-muted-foreground">Email: {session.user.email}</p>
                </div>

                <form action={async () => {
                    "use server"
                    const { signOut } = await import("@/auth")
                    await signOut({ redirectTo: "/" })
                }}>
                    <button type="submit" className="text-sm bg-destructive text-destructive-foreground px-4 py-2 rounded-md hover:bg-destructive/90 transition-colors">
                        Sign Out
                    </button>
                </form>
            </div>
        </div>
    );
}

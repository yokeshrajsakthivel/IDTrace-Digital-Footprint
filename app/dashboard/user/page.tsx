import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/navbar";

export default async function UserDashboard() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="container mx-auto p-8 pt-24">
                <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
                <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20 mb-6">
                    <p>Welcome, <strong>{session.user.name}</strong></p>
                    <p className="text-sm text-muted-foreground mt-2">ID: {session.user.id}</p>
                    <p className="text-sm text-muted-foreground">Email: {session.user.email}</p>
                </div>

                <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2 text-destructive">Danger Zone</h2>
                    <form action={async () => {
                        "use server";
                        await auth() // Re-import not needed for signOut? implementation detail
                        // Using client side signOut is easier in button or use server action from auth.
                        // Since this is a server component, we need a server action or a client component button.
                        // Let's use a standard form for server-side sign out if possible, 
                        // BUT next-auth v5 `signOut` is supported in server actions.
                        const { signOut } = await import("@/auth");
                        await signOut({ redirectTo: "/" });
                    }}>
                        <button type="submit" className="text-sm bg-destructive text-destructive-foreground px-4 py-2 rounded-md hover:bg-destructive/90 transition-colors">
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

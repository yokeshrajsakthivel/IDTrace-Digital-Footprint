
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    try {
        console.log("--- Starting Auth Debug Script ---");

        // 1. Cleanup previous test user if exists
        const testEmail = "debug_test@example.com";
        const testPassword = "password123";

        const existing = await prisma.user.findUnique({ where: { email: testEmail } });
        if (existing) {
            console.log(`Cleaning up existing test user: ${testEmail}`);
            await prisma.user.delete({ where: { email: testEmail } });
        }

        // 2. Hash Password
        console.log(`Hashing password: '${testPassword}'`);
        const hashedPassword = await bcrypt.hash(testPassword, 10);
        console.log(`Generated Hash: ${hashedPassword.substring(0, 20)}...`);

        // 3. Create User
        console.log("Creating user in DB...");
        const newUser = await prisma.user.create({
            data: {
                name: "Debug User",
                email: testEmail,
                password: hashedPassword,
                role: "USER"
            }
        });
        console.log("User created:", newUser.id);

        // 4. Retrieve and Verify
        console.log("Fetching user from DB...");
        const fetchedUser = await prisma.user.findUnique({ where: { email: testEmail } });

        if (!fetchedUser) {
            console.error("CRITICAL: User not found after creation!");
            return;
        }

        console.log("Verifying password...");
        const isMatch = await bcrypt.compare(testPassword, fetchedUser.password);

        if (isMatch) {
            console.log("SUCCESS: Password verified correctly.");
        } else {
            console.error("FAILURE: Password verification failed!");
            console.error(`Input: ${testPassword}`);
            console.error(`Stored Hash: ${fetchedUser.password}`);
        }

    } catch (e) {
        console.error("An unexpected error occurred:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();

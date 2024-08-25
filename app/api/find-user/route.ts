import { NextResponse, NextRequest } from "next/server";
import { connectDB, prisma } from "@/lib/connectdb";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();
        await connectDB(); // Ensure the database is connected

        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (user) {
            return NextResponse.json(user, { status: 200 });
        } else {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 400 });
    }
}
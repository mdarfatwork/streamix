import { NextResponse, NextRequest } from "next/server";
import { connectDB, prisma } from "@/lib/connectdb";

export async function POST(req: NextRequest) {
    try {
        const { email, subscriptionId } = await req.json();
        await connectDB();
        
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (user) {
            const updatedUser = await prisma.user.update({
                where: { email: email },
                data: { subscriptionId: subscriptionId },
            });

            return NextResponse.json(updatedUser, { status: 200 });
        } else {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 400 });
    }
}
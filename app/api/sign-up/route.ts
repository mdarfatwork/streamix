import { NextResponse, NextRequest } from "next/server";
import { connectDB, prisma } from "@/lib/connectdb";

export async function POST(req: NextRequest) {
    try {
        const { createdUserId, firstName, lastName, emailAddress, phone, subscriptionId, customerId } = await req.json();
        const createdAt = new Date();

        await connectDB();

        const newUser = await prisma.user.create({
            data: {
                clerkId: createdUserId,
                firstName: firstName,
                lastName: lastName,
                email: emailAddress,
                phone: phone,
                subscriptionId: subscriptionId,
                customerId: customerId,
                createdAt: createdAt,
            },
        });

        return NextResponse.json({ user: newUser }, { status: 200 });
    } catch (error) {
        console.error(`This is the Error of catch block in register is ${error}`);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
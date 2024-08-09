import { NextResponse, NextRequest } from "next/server";
import { connectDB, prisma } from "@/lib/connectdb";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const deleteUsers = await prisma.user.deleteMany({})
        
        return NextResponse.json({ message: `db was deleted` }, { status: 200 });
    } catch (error) {
        console.error(`This is the Error of catch block in register is ${error}`);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
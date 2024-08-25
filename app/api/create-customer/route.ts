import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID ?? '',
    key_secret: process.env.RAZORPAY_SECRET,
});

export async function POST(req: NextRequest) {
    try {
        const { email, phone } = await req.json();

        const customer = await razorpay.customers.create({
            email: email,
            contact: phone,
        });

        return NextResponse.json({ customerId: customer.id }, { status: 200 });
    } catch (error) {
        console.error("Failed to create Razorpay customer:", error);
        return NextResponse.json({ error: "Failed to create Razorpay customer" }, { status: 500 });
    }
}
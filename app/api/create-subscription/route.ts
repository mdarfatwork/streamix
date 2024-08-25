import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID ?? '',
    key_secret: process.env.RAZORPAY_SECRET,
});

export async function POST(req: NextRequest) {
    try {
        const { customerId } = await req.json();
        const currentTime = Math.floor(Date.now() / 1000);
        const startTime = currentTime + (10 * 60);

        const subscription = await razorpay.subscriptions.create({
            plan_id: process.env.NEXT_PUBLIC_MONTHLY_PLAN_ID ?? '',
            customer_notify: 1,
            total_count: 12,
            start_at: startTime,
            customer_id: customerId,
        });

        return NextResponse.json({ subscriptionId: subscription.id }, { status: 200 });
    } catch (error) {
        console.error(`Error creating subscription: ${error}`);
        return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 });
    }
}
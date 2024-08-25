import { NextResponse, NextRequest } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_SECRET!,
});

export async function POST(req: NextRequest) {
    try {
        const { subscriptionId } = await req.json();
        const subscription = await razorpay.subscriptions.fetch(subscriptionId);
        return NextResponse.json({ subscription }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: `Error fetching subscription: ${error}` }, { status: 400 })
    }
}
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    return NextResponse.json(
      { error: "Payment gateway not configured. RAZORPAY_KEY_SECRET must be set." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingId,
  } = body as {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    bookingId?: string;
  };

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
    return NextResponse.json({ error: "Missing required payment fields" }, { status: 400 });
  }

  // Verify HMAC-SHA256 signature: `${order_id}|${payment_id}`
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  try {
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: "paid",
        paymentId: razorpay_payment_id,
        status: "confirmed",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Booking update after payment failed:", error);
    return NextResponse.json({ error: "Failed to update booking after payment" }, { status: 500 });
  }
}

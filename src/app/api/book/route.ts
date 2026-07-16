import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

// Server-side price map (INR). Do NOT trust client-sent amounts.
// Construction is a quote service — not instantly payable, so omitted here.
const SERVICE_PRICES: Record<string, number> = {
  realestate: 12000,
  wedding: 18000,
  corporate: 25000,
};

const BookingSchema = z.object({
  customerName: z.string().min(1, "Name is required").max(100),
  phone: z.string().min(1, "Phone is required").max(20),
  service: z.enum(["realestate", "wedding", "corporate", "construction"], {
    message: "Invalid service type",
  }),
  location: z.string().min(1, "Location is required").max(200),
  date: z.string().min(1, "Date is required").max(30),
  email: z.string().email("Invalid email").max(254).optional(),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = BookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { customerName, phone, service, location, date, email } = parsed.data;
  // construction is a quote service — no instant price
  const amount = SERVICE_PRICES[service] ?? null;

  try {
    const booking = await db.booking.create({
      data: {
        customerName,
        phone,
        service,
        location,
        date,
        email: email ?? null,
        amount,
        status: "pending",
        paymentStatus: "unpaid",
      },
    });

    return NextResponse.json({ id: booking.id }, { status: 201 });
  } catch (error) {
    console.error("Booking creation failed:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

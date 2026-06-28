import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  email: z.string().email(),
  source: z.string().max(50).optional().default("marketplace"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, source } = schema.parse(body);

    await db.lead.upsert({
      where: { email },
      update: {},
      create: { email, source },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

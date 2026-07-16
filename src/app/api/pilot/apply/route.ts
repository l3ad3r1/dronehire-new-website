import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  name:        z.string().min(1),
  whatsapp:    z.string().min(10),
  areas:       z.string().min(1),
  dgcaId:      z.string().min(1),
  experience:  z.string().optional(),
  droneModels: z.string().min(1),
  shootTypes:  z.string().optional(),
  notes:       z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  const d = parsed.data;
  await db.pilotApplication.upsert({
    where:  { whatsapp: d.whatsapp },
    update: {
      name:        d.name,
      areas:       d.areas,
      dgcaId:      d.dgcaId,
      experience:  d.experience  ?? null,
      droneModels: d.droneModels,
      shootTypes:  d.shootTypes  ?? null,
      notes:       d.notes       ?? null,
    },
    create: {
      name:        d.name,
      whatsapp:    d.whatsapp,
      areas:       d.areas,
      dgcaId:      d.dgcaId,
      experience:  d.experience  ?? null,
      droneModels: d.droneModels,
      shootTypes:  d.shootTypes  ?? null,
      notes:       d.notes       ?? null,
    },
  });
  return NextResponse.json({ success: true });
}


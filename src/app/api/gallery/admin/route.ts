import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { db } from "@/lib/db";

// Token is sent via "Authorization: Bearer <token>" header (never in the URL,
// where it would leak into request logs).
function authorized(req: Request): boolean {
  const secret = process.env.GALLERY_ADMIN_TOKEN;
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!secret || !token) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}

// GET /api/gallery/admin
// Returns all pending submissions so you can review them before approving.
export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pending = await db.gallerySubmission.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(pending);
}

// POST /api/gallery/admin
// Header: Authorization: Bearer <token>
// Body: { id: string, action: "approve" | "reject" }
export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { id, action } = body as Record<string, string>;

  if (!id || (action !== "approve" && action !== "reject")) {
    return NextResponse.json(
      { error: "Required: id (string) and action ('approve' | 'reject')" },
      { status: 400 }
    );
  }

  const existing = await db.gallerySubmission.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }

  const updated = await db.gallerySubmission.update({
    where: { id },
    data: { status: action === "approve" ? "approved" : "rejected" },
  });

  return NextResponse.json({ id: updated.id, status: updated.status });
}

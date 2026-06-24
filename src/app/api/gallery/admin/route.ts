import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function authorized(token: string | null): boolean {
  const secret = process.env.GALLERY_ADMIN_TOKEN;
  return !!secret && token === secret;
}

// GET /api/gallery/admin?token=X
// Returns all pending submissions so you can review them before approving.
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  if (!authorized(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pending = await db.gallerySubmission.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(pending);
}

// POST /api/gallery/admin
// Body: { id: string, action: "approve" | "reject", token: string }
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { id, action, token } = body as Record<string, string>;

  if (!authorized(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

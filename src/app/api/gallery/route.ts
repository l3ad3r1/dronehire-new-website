import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { APPS_SCRIPT_URL } from "@/lib/config";

const submitSchema = z.object({
  pilotName: z.string().min(2).max(100),
  badge: z.string().min(1).max(50),
  title: z.string().min(2).max(150),
  location: z.string().min(2).max(150),
  imageUrl: z.string().url("Must be a valid URL"),
  videoId: z.string().max(20).optional().or(z.literal("")),
});

export async function GET() {
  try {
    const items = await db.gallerySubmission.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const gallery = items.map((item) => ({
      image: item.imageUrl,
      badge: item.badge,
      title: item.title,
      location: item.location,
      videoId: item.videoId ?? undefined,
    }));

    return NextResponse.json(gallery);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = submitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { pilotName, badge, title, location, imageUrl, videoId } = parsed.data;

    const submission = await db.gallerySubmission.create({
      data: {
        pilotName,
        badge,
        title,
        location,
        imageUrl,
        videoId: videoId || null,
        status: "approved",
      },
    });

    // Notify via Google Apps Script (fire-and-forget)
    if (APPS_SCRIPT_URL) {
      fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          formType: "gallerySubmission",
          id: submission.id,
          pilotName,
          badge,
          title,
          location,
          imageUrl,
          videoId: videoId || "",
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ id: submission.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}

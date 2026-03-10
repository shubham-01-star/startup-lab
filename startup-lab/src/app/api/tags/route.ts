import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { Tag } from "@/entities/Tag";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/utils";

// GET /api/tags
export async function GET() {
    const db = await getDB();
    const tags = await db.getRepository(Tag).find({ order: { name: "ASC" } });
    return NextResponse.json(tags);
}

// POST /api/tags
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDB();
    const repo = db.getRepository(Tag);
    const body = await req.json();

    const tag = repo.create({
        name: body.name,
        slug: body.slug || slugify(body.name),
        color: body.color || "#6C63FF",
    });

    await repo.save(tag);
    return NextResponse.json(tag, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { Profile } from "@/entities/Profile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/profile — Public
export async function GET() {
    const db = await getDB();
    const profile = await db.getRepository(Profile).findOne({ where: { id: 1 } });
    return NextResponse.json(profile || {});
}

// PUT /api/profile — Admin
export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDB();
    const repo = db.getRepository(Profile);
    const body = await req.json();

    const existing = await repo.findOne({ where: { id: 1 } });

    if (!existing) {
        const newProfile = repo.create({ id: 1, ...body } as Profile);
        const saved = await repo.save(newProfile);
        return NextResponse.json(saved);
    }

    Object.assign(existing, body);
    const saved = await repo.save(existing);
    return NextResponse.json(saved);
}

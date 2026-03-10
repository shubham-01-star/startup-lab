import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { Project } from "@/entities/Project";
import { Tag } from "@/entities/Tag";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/projects/[id]
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const db = await getDB();
    const repo = db.getRepository(Project);

    const project = await repo.findOne({
        where: [{ slug: id }, { id: parseInt(id) || 0 }],
        relations: ["tags"],
    });

    if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
}

// PUT /api/projects/[id]
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = await getDB();
    const repo = db.getRepository(Project);
    const tagRepo = db.getRepository(Tag);
    const body = await req.json();

    const project = await repo.findOne({
        where: { id: parseInt(id) },
        relations: ["tags"],
    });

    if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    Object.assign(project, {
        title: body.title ?? project.title,
        slug: body.slug ?? project.slug,
        description: body.description ?? project.description,
        content: body.content ?? project.content,
        thumbnail: body.thumbnail ?? project.thumbnail,
        tech_stack: body.tech_stack ?? project.tech_stack,
        live_url: body.live_url ?? project.live_url,
        github_url: body.github_url ?? project.github_url,
        subdomain: body.subdomain ?? project.subdomain,
        status: body.status ?? project.status,
        is_featured: body.is_featured ?? project.is_featured,
        sort_order: body.sort_order ?? project.sort_order,
    });

    if (body.tagIds) {
        project.tags = await tagRepo.findByIds(body.tagIds);
    }

    await repo.save(project);

    return NextResponse.json(project);
}

// DELETE /api/projects/[id]
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = await getDB();
    await db.getRepository(Project).delete(parseInt(id));

    return NextResponse.json({ success: true });
}

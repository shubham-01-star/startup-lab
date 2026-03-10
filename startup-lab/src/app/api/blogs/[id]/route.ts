import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { Blog } from "@/entities/Blog";
import { Tag } from "@/entities/Tag";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { calculateReadTime } from "@/lib/utils";

// GET /api/blogs/[id] — Get single blog by slug or id
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const db = await getDB();
    const repo = db.getRepository(Blog);

    const blog = await repo.findOne({
        where: [{ slug: id }, { id: parseInt(id) || 0 }],
        relations: ["tags", "author"],
    });

    if (!blog) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
}

// PUT /api/blogs/[id] — Admin: update blog
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
    const repo = db.getRepository(Blog);
    const tagRepo = db.getRepository(Tag);
    const body = await req.json();

    const blog = await repo.findOne({
        where: { id: parseInt(id) },
        relations: ["tags"],
    });

    if (!blog) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    if (body.content) {
        body.read_time = calculateReadTime(body.content);
    }

    if (body.status === "published" && blog.status !== "published") {
        body.published_at = new Date();
    }

    Object.assign(blog, {
        title: body.title ?? blog.title,
        slug: body.slug ?? blog.slug,
        excerpt: body.excerpt ?? blog.excerpt,
        content: body.content ?? blog.content,
        cover_image: body.cover_image ?? blog.cover_image,
        status: body.status ?? blog.status,
        is_featured: body.is_featured ?? blog.is_featured,
        read_time: body.read_time ?? blog.read_time,
        published_at: body.published_at ?? blog.published_at,
    });

    if (body.tagIds) {
        blog.tags = await tagRepo.findByIds(body.tagIds);
    }

    await repo.save(blog);

    return NextResponse.json(blog);
}

// DELETE /api/blogs/[id] — Admin: delete blog
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
    const repo = db.getRepository(Blog);

    await repo.delete(parseInt(id));

    return NextResponse.json({ success: true });
}

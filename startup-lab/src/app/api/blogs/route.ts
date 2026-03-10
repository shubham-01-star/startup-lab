import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { Blog } from "@/entities/Blog";
import { Tag } from "@/entities/Tag";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { slugify, calculateReadTime } from "@/lib/utils";

// GET /api/blogs — Public: list published blogs
export async function GET(req: NextRequest) {
    const db = await getDB();
    const repo = db.getRepository(Blog);
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    const status = searchParams.get("status"); // admin only

    const session = await getServerSession(authOptions);
    const isAdmin = !!session?.user;

    const qb = repo
        .createQueryBuilder("blog")
        .leftJoinAndSelect("blog.tags", "tag")
        .orderBy("blog.created_at", "DESC");

    if (!isAdmin) {
        qb.where("blog.status = :status", { status: "published" });
    } else if (status) {
        qb.where("blog.status = :status", { status });
    }

    if (tag) {
        qb.andWhere("tag.slug = :tag", { tag });
    }

    if (search) {
        qb.andWhere("(blog.title LIKE :search OR blog.excerpt LIKE :search)", {
            search: `%${search}%`,
        });
    }

    const [blogs, total] = await qb
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

    return NextResponse.json({
        blogs,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
}

// POST /api/blogs — Admin: create blog
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDB();
    const repo = db.getRepository(Blog);
    const tagRepo = db.getRepository(Tag);
    const body = await req.json();

    const slug = body.slug || slugify(body.title);
    const readTime = calculateReadTime(body.content || "");

    const blog = repo.create({
        title: body.title,
        slug,
        excerpt: body.excerpt,
        content: body.content,
        cover_image: body.cover_image,
        author_id: parseInt((session.user as { id: string }).id),
        status: body.status || "draft",
        is_featured: body.is_featured || false,
        read_time: readTime,
        published_at: body.status === "published" ? new Date() : undefined,
    });

    if (body.tagIds?.length) {
        blog.tags = await tagRepo.findByIds(body.tagIds);
    }

    await repo.save(blog);

    return NextResponse.json(blog, { status: 201 });
}

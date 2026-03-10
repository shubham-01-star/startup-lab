import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { Project } from "@/entities/Project";
import { Tag } from "@/entities/Tag";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/utils";

// GET /api/projects — List projects
export async function GET(req: NextRequest) {
    const db = await getDB();
    const repo = db.getRepository(Project);
    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");

    const qb = repo
        .createQueryBuilder("project")
        .leftJoinAndSelect("project.tags", "tag")
        .orderBy("project.sort_order", "ASC");

    if (status) {
        qb.where("project.status = :status", { status });
    }

    if (featured === "true") {
        qb.andWhere("project.is_featured = :featured", { featured: true });
    }

    if (search) {
        qb.andWhere("(project.title LIKE :search OR project.description LIKE :search)", {
            search: `%${search}%`,
        });
    }

    const projects = await qb.getMany();

    return NextResponse.json({ projects });
}

// POST /api/projects — Admin: create project
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDB();
    const repo = db.getRepository(Project);
    const tagRepo = db.getRepository(Tag);
    const body = await req.json();

    const slug = body.slug || slugify(body.title);

    const project = repo.create({
        title: body.title,
        slug,
        description: body.description,
        content: body.content,
        thumbnail: body.thumbnail,
        tech_stack: body.tech_stack || [],
        live_url: body.live_url,
        github_url: body.github_url,
        subdomain: body.subdomain,
        status: body.status || "idea",
        is_featured: body.is_featured || false,
        sort_order: body.sort_order || 0,
    });

    if (body.tagIds?.length) {
        project.tags = await tagRepo.findByIds(body.tagIds);
    }

    await repo.save(project);

    return NextResponse.json(project, { status: 201 });
}

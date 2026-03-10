import { getDB } from "@/lib/db";
import { Blog } from "@/entities/Blog";
import BlogClient from "./BlogClient";

async function getBlogs() {
    const db = await getDB();
    const blogs = await db.getRepository(Blog).find({
        where: { status: "published" },
        order: { published_at: "DESC" },
        relations: ["tags"],
    });
    return JSON.parse(JSON.stringify(blogs));
}

export default async function BlogPage() {
    const blogs = await getBlogs();
    return <BlogClient blogs={blogs} />;
}

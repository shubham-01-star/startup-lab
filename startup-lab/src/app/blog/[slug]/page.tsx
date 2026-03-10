import Image from "next/image";
import Link from "next/link";
import { getDB } from "@/lib/db";
import { Blog } from "@/entities/Blog";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Eye, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

async function getBlog(slug: string) {
    const db = await getDB();
    const blog = await db.getRepository(Blog).findOne({
        where: { slug, status: "published" },
        relations: ["tags", "author"],
    });

    if (blog) {
        // Increment views
        await db
            .getRepository(Blog)
            .update(blog.id, { views: () => "views + 1" });
    }

    return blog;
}

async function getRelatedBlogs(blog: Blog) {
    const db = await getDB();
    const currentTagIds = blog.tags?.map((tag) => tag.id) ?? [];

    if (currentTagIds.length > 0) {
        const related = await db
            .getRepository(Blog)
            .createQueryBuilder("blog")
            .leftJoinAndSelect("blog.tags", "tag")
            .where("blog.status = :status", { status: "published" })
            .andWhere("blog.id != :id", { id: blog.id })
            .andWhere("tag.id IN (:...tagIds)", { tagIds: currentTagIds })
            .orderBy("blog.published_at", "DESC")
            .take(3)
            .getMany();

        if (related.length > 0) return related;
    }

    return db.getRepository(Blog).find({
        where: { status: "published" },
        relations: ["tags"],
        order: { published_at: "DESC" },
        take: 3,
    });
}

function slugifyHeading(value: string) {
    return value
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

export default async function BlogDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const blog = await getBlog(slug);

    if (!blog) notFound();

    const relatedBlogs = (await getRelatedBlogs(blog)).filter((item) => item.id !== blog.id).slice(0, 3);
    const tocItems = (blog.content ?? "")
        .split("\n")
        .filter((line) => line.trim().startsWith("#"))
        .map((line) => line.replace(/^#+\s*/, "").trim())
        .filter(Boolean)
        .map((title) => ({ title, id: slugifyHeading(title) }));
    const contentLines = (blog.content ?? "").split("\n");

    return (
        <div className="min-h-screen bg-bg-primary">

            <article className="max-w-3xl mx-auto px-6 pt-28 pb-20 animate-fade-in">
                <Link
                    href="/blog"
                    className="text-text-secondary text-sm hover:text-accent-primary transition-colors flex items-center gap-1 mb-8"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Blog
                </Link>

                {/* Header */}
                <header className="mb-8">
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {blog.tags?.map((tag) => (
                            <span
                                key={tag.id}
                                className="text-xs px-2 py-0.5 rounded-full border"
                                style={{ borderColor: tag.color + "40", color: tag.color }}
                            >
                                #{tag.slug}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-4xl font-bold text-text-primary mb-4 leading-tight">
                        {blog.title}
                    </h1>
                    {blog.excerpt && (
                        <p className="text-text-secondary text-lg mb-4">{blog.excerpt}</p>
                    )}
                    <div className="flex items-center gap-4 text-text-secondary text-sm">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(blog.published_at || blog.created_at).toLocaleDateString("en-US", {
                                month: "long", day: "numeric", year: "numeric",
                            })}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" /> {blog.read_time} min read
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" /> {blog.views} views
                        </span>
                    </div>
                </header>

                {/* Cover Image */}
                {blog.cover_image && (
                    <div className="glass rounded-2xl overflow-hidden mb-8">
                        <Image
                            src={blog.cover_image}
                            alt={blog.title}
                            width={1200}
                            height={600}
                            className="w-full h-auto"
                            unoptimized
                        />
                    </div>
                )}

                {tocItems.length > 0 && (
                    <section className="glass rounded-2xl p-5 mb-8">
                        <p className="text-text-primary font-semibold mb-3">On this page</p>
                        <div className="flex flex-col gap-2">
                            {tocItems.map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                                >
                                    {item.title}
                                </a>
                            ))}
                        </div>
                    </section>
                )}

                {/* Content */}
                <div
                    className="prose prose-invert max-w-none text-text-secondary leading-relaxed prose-headings:text-text-primary prose-a:text-accent-primary prose-strong:text-text-primary prose-code:text-accent-secondary"
                    style={{ whiteSpace: "pre-wrap" }}
                >
                    {contentLines.map((line, index) => {
                        const trimmed = line.trim();

                        if (trimmed.startsWith("### ")) {
                            const title = trimmed.replace(/^###\s+/, "");
                            return (
                                <h3 key={`${title}-${index}`} id={slugifyHeading(title)}>
                                    {title}
                                </h3>
                            );
                        }

                        if (trimmed.startsWith("## ")) {
                            const title = trimmed.replace(/^##\s+/, "");
                            return (
                                <h2 key={`${title}-${index}`} id={slugifyHeading(title)}>
                                    {title}
                                </h2>
                            );
                        }

                        if (trimmed.startsWith("# ")) {
                            const title = trimmed.replace(/^#\s+/, "");
                            return (
                                <h1 key={`${title}-${index}`} id={slugifyHeading(title)}>
                                    {title}
                                </h1>
                            );
                        }

                        return <p key={index}>{line}</p>;
                    })}
                </div>

                <section className="glass rounded-2xl p-6 mt-12">
                    <p className="text-text-secondary text-sm mb-2">Written by</p>
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-accent-primary/15 text-accent-primary flex items-center justify-center text-lg">
                            👤
                        </div>
                        <div>
                            <h2 className="text-text-primary text-lg font-semibold mb-1">Shubham Kumar</h2>
                            <p className="text-text-secondary text-sm">
                                Backend Engineer • AI Builder
                            </p>
                            <p className="text-text-secondary text-sm mt-2">
                                Building backend systems and AI products in public through Startup Lab.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Share */}
                <div className="border-t border-border mt-12 pt-8">
                    <p className="text-text-secondary text-sm mb-3">Share this post:</p>
                    <div className="flex items-center gap-3">
                        <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(`https://startup-lab.cloud/blog/${blog.slug}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-lg border border-border text-text-secondary text-sm hover:bg-bg-tertiary transition-all"
                        >
                            Twitter/X
                        </a>
                        <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://startup-lab.cloud/blog/${blog.slug}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-lg border border-border text-text-secondary text-sm hover:bg-bg-tertiary transition-all"
                        >
                            LinkedIn
                        </a>
                    </div>
                </div>

                {relatedBlogs.length > 0 && (
                    <section className="mt-12">
                        <h2 className="text-text-primary text-2xl font-semibold mb-4">You might also like</h2>
                        <div className="grid gap-4 md:grid-cols-3">
                            {relatedBlogs.map((related) => (
                                <Link
                                    key={related.id}
                                    href={`/blog/${related.slug}`}
                                    className="glass rounded-2xl p-5 hover:border-accent-primary/40 transition-colors"
                                >
                                    <p className="text-text-primary font-semibold mb-2">{related.title}</p>
                                    <p className="text-text-secondary text-sm line-clamp-3">
                                        {related.excerpt}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </article>
        </div>
    );
}

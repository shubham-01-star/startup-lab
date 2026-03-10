"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

interface Tag {
    id: number;
    name: string;
    slug: string;
    color: string;
}

interface Blog {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    cover_image: string;
    status: string;
    is_featured: boolean;
    read_time: number;
    views: number;
    published_at: string;
    tags: Tag[];
}

interface BlogClientProps {
    blogs: Blog[];
}

const ALL_FILTER = "All";
const PAGE_SIZE = 6;

export default function BlogClient({ blogs }: BlogClientProps) {
    const [search, setSearch] = useState("");
    const [activeTag, setActiveTag] = useState(ALL_FILTER);
    const [page, setPage] = useState(1);

    // Collect unique tags from all blogs
    const allTags = useMemo(() => {
        const tagMap = new Map<string, string>();
        blogs.forEach((blog) =>
            blog.tags?.forEach((t) => tagMap.set(t.name, t.slug))
        );
        return Array.from(tagMap.keys());
    }, [blogs]);

    const featuredBlog = blogs.find((b) => b.is_featured);
    const nonFeaturedBlogs = blogs.filter((b) => !b.is_featured);

    const filtered = useMemo(() => {
        return nonFeaturedBlogs.filter((blog) => {
            const matchSearch =
                blog.title.toLowerCase().includes(search.toLowerCase()) ||
                blog.excerpt?.toLowerCase().includes(search.toLowerCase());
            const matchTag =
                activeTag === ALL_FILTER ||
                blog.tags?.some((t) => t.name === activeTag);
            return matchSearch && matchTag;
        });
    }, [nonFeaturedBlogs, search, activeTag]);

    const visibleBlogs = filtered.slice(0, page * PAGE_SIZE);
    const hasMore = visibleBlogs.length < filtered.length;

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <>
            {/* Google Fonts */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');

                .blog-page * {
                    box-sizing: border-box;
                    font-family: 'Space Grotesk', sans-serif;
                }

                .glass-card {
                    background: var(--color-bg-secondary);
                    backdrop-filter: blur(10px);
                    border: 1px solid var(--color-border);
                    transition: all 0.3s ease;
                }

                .glass-card:hover {
                    border-color: rgba(34, 19, 236, 0.4);
                    background: var(--color-bg-secondary);
                    transform: translateY(-2px);
                }

                .blog-tag-active {
                    background: linear-gradient(135deg, #2213ec 0%, #00d2ff 100%);
                    color: var(--color-text-primary);
                    border: none;
                }

                .blog-tag-inactive {
                    background: var(--color-bg-secondary);
                    border: 1px solid var(--color-border);
                    color: var(--color-text-secondary);
                }

                .blog-tag-inactive:hover {
                    background: var(--color-bg-secondary);
                }

                .load-more-btn {
                    border: 2px solid transparent;
                    background-image: linear-gradient(var(--color-bg-primary), var(--color-bg-primary)), linear-gradient(135deg, #2213ec 0%, #00d2ff 100%);
                    background-origin: border-box;
                    background-clip: padding-box, border-box;
                    color: var(--color-text-primary);
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .load-more-btn:hover {
                    box-shadow: 0 0 20px rgba(34, 19, 236, 0.3);
                    transform: scale(1.02);
                }

                .load-more-btn:active {
                    transform: scale(0.97);
                }

                .featured-img-wrap {
                    position: relative;
                    overflow: hidden;
                }

                .featured-img-wrap img {
                    transition: transform 0.5s ease;
                }

                .featured-card:hover .featured-img-wrap img {
                    transform: scale(1.05);
                }

                .blog-card-img-wrap img {
                    transition: transform 0.5s ease;
                }

                .blog-card:hover .blog-card-img-wrap img {
                    transform: scale(1.05);
                }

                .search-input:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px rgba(34, 19, 236, 0.5);
                }

                .blog-card:hover h3 {
                    color: #2213ec;
                }

                .featured-card:hover h2 {
                    color: #2213ec;
                }

                .msymbol {
                    font-family: 'Material Symbols Outlined';
                    font-weight: normal;
                    font-style: normal;
                    display: inline-block;
                    line-height: 1;
                    text-transform: none;
                    letter-spacing: normal;
                    word-wrap: normal;
                    white-space: nowrap;
                    direction: ltr;
                    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                    vertical-align: middle;
                }
            `}</style>

            <main
                className="blog-page"
                style={{
                    background: "transparent",
                    minHeight: "100vh",
                    color: "var(--color-text-primary)",
                }}
            >
                {/* ── Main Content ── */}
                <div
                    style={{
                        maxWidth: 1280,
                        margin: "0 auto",
                        padding: "112px 24px 80px",
                    }}
                >
                    {/* ── Hero Header ── */}
                    <div style={{ marginBottom: 48 }}>
                        <h1
                            style={{
                                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                                fontWeight: 900,
                                color: "var(--color-text-primary)",
                                marginBottom: 16,
                                letterSpacing: "-0.02em",
                                lineHeight: 1.1,
                            }}
                        >
                            Lab Notes
                        </h1>
                        <p
                            style={{
                                color: "var(--color-text-secondary)",
                                fontSize: 18,
                                maxWidth: 600,
                                fontWeight: 300,
                                lineHeight: 1.6,
                            }}
                        >
                            Build logs, backend notes, and lessons from shipping products on the internet.
                        </p>
                        <p style={{ color: "var(--color-text-secondary)", fontSize: 14, margin: "12px 0 0", fontWeight: 500 }}>
                            {blogs.length} lab notes and counting.
                        </p>
                        {allTags.length > 0 && (
                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
                                {allTags.slice(0, 6).map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => { setActiveTag(tag); setPage(1); }}
                                        className={activeTag === tag ? "blog-tag-active" : "blog-tag-inactive"}
                                        style={{
                                            padding: "7px 16px",
                                            borderRadius: 9999,
                                            fontSize: 12,
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            fontFamily: "'Space Grotesk', sans-serif",
                                        }}
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Search + Filters ── */}
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 24,
                            marginBottom: 48,
                        }}
                    >
                        {/* Search */}
                        <div style={{ position: "relative", flex: "1 1 280px", maxWidth: 400 }}>
                            <span
                                className="msymbol"
                                style={{
                                    position: "absolute",
                                    left: 16,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    color: "var(--color-text-secondary)",
                                    fontSize: 20,
                                }}
                            >
                                search
                            </span>
                            <input
                                className="search-input"
                                type="text"
                                placeholder="Search lab notes..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                style={{
                                    width: "100%",
                                    background: "var(--color-bg-secondary)",
                                    border: "1px solid var(--color-border)",
                                    borderRadius: 12,
                                    padding: "12px 16px 12px 48px",
                                    color: "var(--color-text-primary)",
                                    fontSize: 15,
                                    transition: "all 0.2s",
                                }}
                            />
                        </div>

                        {/* Tag pills */}
                        <div
                            style={{
                                display: "flex",
                                gap: 8,
                                flexWrap: "wrap",
                                flex: "1 1 auto",
                            }}
                        >
                            {[ALL_FILTER, ...allTags].map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => { setActiveTag(tag); setPage(1); }}
                                    className={activeTag === tag ? "blog-tag-active" : "blog-tag-inactive"}
                                    style={{
                                        padding: "8px 20px",
                                        borderRadius: 9999,
                                        fontSize: 14,
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
                                        transition: "all 0.2s",
                                        fontFamily: "'Space Grotesk', sans-serif",
                                    }}
                                >
                                    {tag === ALL_FILTER ? "All" : `#${tag}`}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Featured Post ── */}
                    {featuredBlog && (
                        <div style={{ marginBottom: 48 }}>
                            <Link href={`/blog/${featuredBlog.slug}`} style={{ textDecoration: "none" }}>
                                <div
                                    className="glass-card featured-card"
                                    style={{
                                        borderRadius: 16,
                                        overflow: "hidden",
                                        display: "flex",
                                        flexDirection: "row",
                                        flexWrap: "wrap",
                                        cursor: "pointer",
                                    }}
                                >
                                    {/* Cover image / left panel */}
                                    <div
                                        className="featured-img-wrap"
                                        style={{
                                            flex: "1 1 300px",
                                            minHeight: 280,
                                            position: "relative",
                                            background: "var(--color-bg-tertiary)",
                                        }}
                                    >
                                        {/* gradient overlay */}
                                        <div
                                            style={{
                                                position: "absolute",
                                                inset: 0,
                                                background: "linear-gradient(135deg, #2213ec 0%, #00d2ff 100%)",
                                                opacity: 0.35,
                                                mixBlendMode: "overlay",
                                                zIndex: 1,
                                            }}
                                        />
                                        {featuredBlog.cover_image ? (
                                            <Image
                                                src={featuredBlog.cover_image}
                                                alt={featuredBlog.title}
                                                fill
                                                unoptimized
                                                sizes="(max-width: 1024px) 100vw, 50vw"
                                                style={{
                                                    objectFit: "cover",
                                                }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    width: "100%",
                                                    minHeight: 280,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: 72,
                                                }}
                                            >
                                                📝
                                            </div>
                                        )}
                                        {/* Featured badge */}
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: 16,
                                                left: 16,
                                                zIndex: 2,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    background: "rgba(34,19,236,0.85)",
                                                    backdropFilter: "blur(8px)",
                                                    color: "#fff",
                                                    padding: "4px 12px",
                                                    borderRadius: 4,
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    letterSpacing: "0.08em",
                                                    textTransform: "uppercase",
                                                }}
                                            >
                                                Featured Note
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right content */}
                                    <div
                                        style={{
                                            flex: "1 1 320px",
                                            padding: "32px",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {/* Tags */}
                                        <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                                            {featuredBlog.tags?.slice(0, 3).map((t) => (
                                                <span
                                                    key={t.id}
                                                    style={{
                                                        color: "#2213ec",
                                                        fontSize: 11,
                                                        fontWeight: 700,
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.08em",
                                                    }}
                                                >
                                                    #{t.name}
                                                </span>
                                            ))}
                                        </div>

                                        <h2
                                            style={{
                                                fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
                                                fontWeight: 700,
                                                color: "var(--color-text-primary)",
                                                marginBottom: 16,
                                                lineHeight: 1.3,
                                                transition: "color 0.2s",
                                            }}
                                        >
                                            {featuredBlog.title}
                                        </h2>

                                        <p
                                            style={{
                                                color: "var(--color-text-secondary)",
                                                fontSize: 15,
                                                lineHeight: 1.7,
                                                marginBottom: 24,
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {featuredBlog.excerpt}
                                        </p>

                                        {/* Meta */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                borderTop: "1px solid var(--color-border)",
                                                paddingTop: 20,
                                                marginTop: "auto",
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                <div
                                                    style={{
                                                        width: 36,
                                                        height: 36,
                                                        borderRadius: "50%",
                                                        background: "rgba(34,19,236,0.15)",
                                                        border: "1px solid rgba(34,19,236,0.3)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: 18,
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    👤
                                                </div>
                                                <div>
                                                    <p style={{ color: "var(--color-text-primary)", fontWeight: 700, fontSize: 13, margin: 0 }}>
                                                        Shubham Kumar
                                                    </p>
                                                    <p style={{ color: "var(--color-text-secondary)", fontSize: 11, margin: 0 }}>
                                                        {formatDate(featuredBlog.published_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", gap: 16, color: "var(--color-text-secondary)", fontSize: 12, alignItems: "center" }}>
                                                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                    <span className="msymbol" style={{ fontSize: 15 }}>schedule</span>
                                                    {featuredBlog.read_time || 5} min read
                                                </span>
                                                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                    <span className="msymbol" style={{ fontSize: 15 }}>visibility</span>
                                                    {featuredBlog.views}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}

                    {/* ── Blog Grid ── */}
                    {filtered.length === 0 ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "80px 24px 96px",
                                textAlign: "center",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            {/* Radial glow background */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: "40%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    width: 480,
                                    height: 480,
                                    borderRadius: "50%",
                                    background: "radial-gradient(circle, rgba(34,19,236,0.12) 0%, transparent 70%)",
                                    pointerEvents: "none",
                                }}
                            />

                            {/* Icon */}
                            <div
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: "50%",
                                    background: "rgba(34,19,236,0.12)",
                                    border: "1px solid rgba(34,19,236,0.25)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: 28,
                                    position: "relative",
                                    zIndex: 1,
                                }}
                            >
                                <span className="msymbol" style={{ fontSize: 36, color: "#2213ec" }}>
                                    search_off
                                </span>
                            </div>

                            <h3
                                style={{
                                    fontSize: 28,
                                    fontWeight: 700,
                                    color: "var(--color-text-primary)",
                                    margin: "0 0 12px",
                                    position: "relative",
                                    zIndex: 1,
                                }}
                            >
                                No lab notes found
                            </h3>
                            <p
                                style={{
                                    color: "var(--color-text-secondary)",
                                    fontSize: 16,
                                    maxWidth: 380,
                                    lineHeight: 1.65,
                                    margin: "0 0 32px",
                                    position: "relative",
                                    zIndex: 1,
                                }}
                            >
                                {search
                                    ? `No results for "${search}". Try a different keyword or browse all notes.`
                                    : "No notes match the selected tag. Try a different filter or view all notes."}
                            </p>

                            {/* CTA */}
                            <button
                                onClick={() => { setSearch(""); setActiveTag(ALL_FILTER); setPage(1); }}
                                style={{
                                    padding: "13px 32px",
                                    borderRadius: 9999,
                                    border: "none",
                                    background: "linear-gradient(135deg, #2213ec 0%, #00d2ff 100%)",
                                    color: "#fff",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    fontSize: 15,
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    position: "relative",
                                    zIndex: 1,
                                    marginBottom: 40,
                                    transition: "opacity 0.2s",
                                }}
                            >
                                <span className="msymbol" style={{ fontSize: 18 }}>refresh</span>
                                Clear Filters
                            </button>

                            {/* Suggested topics */}
                            {allTags.length > 0 && (
                                <div style={{ position: "relative", zIndex: 1 }}>
                                    <p style={{ color: "var(--color-text-secondary)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
                                        Browse by topic
                                    </p>
                                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                                        {allTags.slice(0, 6).map((tag) => (
                                            <button
                                                key={tag}
                                                onClick={() => { setActiveTag(tag); setSearch(""); setPage(1); }}
                                                className="blog-tag-inactive"
                                                style={{
                                                    padding: "7px 18px",
                                                    borderRadius: 9999,
                                                    fontSize: 13,
                                                    fontWeight: 500,
                                                    cursor: "pointer",
                                                    fontFamily: "'Space Grotesk', sans-serif",
                                                }}
                                            >
                                                #{tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                                gap: 32,
                            }}
                        >
                            {visibleBlogs.map((blog) => (
                                <Link key={blog.id} href={`/blog/${blog.slug}`} style={{ textDecoration: "none" }}>
                                    <article
                                        className="glass-card blog-card"
                                        style={{
                                            borderRadius: 16,
                                            overflow: "hidden",
                                            display: "flex",
                                            flexDirection: "column",
                                            height: "100%",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {/* Cover image */}
                                        <div
                                            className="blog-card-img-wrap"
                                            style={{
                                                height: 192,
                                                position: "relative",
                                                overflow: "hidden",
                                                background: "var(--color-bg-tertiary)",
                                            }}
                                        >
                                            {blog.cover_image ? (
                                                <Image
                                                    src={blog.cover_image}
                                                    alt={blog.title}
                                                    fill
                                                    unoptimized
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 340px"
                                                    style={{
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: 48,
                                                    }}
                                                >
                                                    📄
                                                </div>
                                            )}
                                            {/* Gradient overlay */}
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    inset: 0,
                                                    background: "linear-gradient(to top, var(--color-bg-primary) 0%, transparent 60%)",
                                                    opacity: 0.6,
                                                }}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div
                                            style={{
                                                padding: "24px",
                                                flex: 1,
                                                display: "flex",
                                                flexDirection: "column",
                                            }}
                                        >
                                            {/* Tags */}
                                            <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                                                {blog.tags?.slice(0, 2).map((t) => (
                                                    <span
                                                        key={t.id}
                                                        style={{
                                                            color: "#2213ec",
                                                            fontSize: 10,
                                                            fontWeight: 700,
                                                            textTransform: "uppercase",
                                                            letterSpacing: "0.06em",
                                                        }}
                                                    >
                                                        #{t.name}
                                                    </span>
                                                ))}
                                            </div>

                                            <h3
                                                style={{
                                                    fontSize: 18,
                                                    fontWeight: 700,
                                                    color: "var(--color-text-primary)",
                                                    margin: "0 0 12px",
                                                    lineHeight: 1.4,
                                                    transition: "color 0.2s",
                                                }}
                                            >
                                                {blog.title}
                                            </h3>

                                            <p
                                                style={{
                                                    color: "var(--color-text-secondary)",
                                                    fontSize: 14,
                                                    lineHeight: 1.65,
                                                    flex: 1,
                                                    margin: "0 0 20px",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                {blog.excerpt}
                                            </p>

                                            {/* Footer meta */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    borderTop: "1px solid var(--color-border)",
                                                    paddingTop: 16,
                                                    fontSize: 11,
                                                    color: "var(--color-text-secondary)",
                                                    fontWeight: 500,
                                                }}
                                            >
                                                <span>{formatDate(blog.published_at)}</span>
                                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                        <span className="msymbol" style={{ fontSize: 14 }}>schedule</span>
                                                        {blog.read_time || 5} min read
                                                    </span>
                                                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                        <span className="msymbol" style={{ fontSize: 14 }}>visibility</span>
                                                        {blog.views}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* ── Load More ── */}
                    {hasMore && (
                        <div style={{ marginTop: 80, display: "flex", justifyContent: "center" }}>
                            <button
                                className="load-more-btn"
                                onClick={() => setPage((p) => p + 1)}
                                style={{
                                    padding: "16px 40px",
                                    borderRadius: 12,
                                    fontSize: 15,
                                    fontFamily: "'Space Grotesk', sans-serif",
                                }}
                            >
                                Load More Posts
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

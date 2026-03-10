"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Tag {
    id: number;
    name: string;
    slug: string;
    color: string;
}

interface Project {
    id: number;
    title: string;
    slug: string;
    description: string;
    thumbnail: string;
    tech_stack: string[];
    live_url: string;
    github_url: string;
    subdomain: string;
    status: "idea" | "in_progress" | "live" | "archived";
    is_featured: boolean;
    sort_order: number;
    tags: Tag[];
}

interface ProjectsClientProps {
    projects: Project[];
}

type StatusFilter = "All" | "live" | "in_progress" | "archived" | "idea";

const STATUS_LABELS: Record<string, string> = {
    live: "Live",
    in_progress: "In Progress",
    archived: "Archived",
    idea: "Idea",
};

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
    live: { bg: "rgba(0,230,118,0.12)", text: "#00e676", dot: "#00e676" },
    in_progress: { bg: "rgba(255,152,0,0.12)", text: "#ffa726", dot: "#ffa726" },
    archived: { bg: "rgba(150,150,150,0.12)", text: "#777", dot: "#555" },
    idea: { bg: "rgba(108,99,255,0.12)", text: "#9a93ff", dot: "#6C63FF" },
};

export default function ProjectsClient({ projects }: ProjectsClientProps) {
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState<StatusFilter>("All");

    const filtered = useMemo(() => {
        const list = activeFilter === "All"
            ? projects
            : projects.filter((p) => p.status === activeFilter);

        return [...list].sort((a, b) => {
            if (a.is_featured && !b.is_featured) return -1;
            if (!a.is_featured && b.is_featured) return 1;
            return a.sort_order - b.sort_order;
        });
    }, [projects, activeFilter]);

    const liveCount = useMemo(
        () => projects.filter((project) => project.status === "live").length,
        [projects]
    );

    const ideaCount = useMemo(
        () => projects.filter((project) => project.status === "idea").length,
        [projects]
    );

    const filterTabs: StatusFilter[] = ["All", "live", "in_progress", "archived", "idea"];

    return (
        <main style={{ background: "transparent", minHeight: "100vh", color: "var(--color-text-primary)", fontFamily: "'Inter', sans-serif" }}>
            {/* ── Hero ── */}
            <section
                style={{
                    padding: "120px 24px 48px",
                    maxWidth: 1200,
                    margin: "0 auto",
                    textAlign: "center",
                }}
            >
                <span
                    style={{
                        display: "inline-block",
                        background: "rgba(108,99,255,0.15)",
                        color: "#6C63FF",
                        border: "1px solid rgba(108,99,255,0.4)",
                        borderRadius: 999,
                        padding: "4px 16px",
                        fontSize: 13,
                        fontWeight: 600,
                        marginBottom: 20,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                    }}
                >
                    Experiments
                </span>
                <h1
                    style={{
                        fontSize: "clamp(2rem, 5vw, 3.5rem)",
                        fontWeight: 800,
                        margin: "0 0 16px",
                        background: "linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-text-secondary) 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        lineHeight: 1.15,
                    }}
                >
                    Experiments From The Lab
                </h1>
                <p style={{ color: "#a0a0b0", fontSize: 18, maxWidth: 520, margin: "0 auto" }}>
                    Experiments that turned into real internet products, prototypes, and hard-won lessons.
                </p>
                <div style={{ marginTop: 24, fontSize: 14, color: "#888" }}>
                    {projects.length} Experiments • {liveCount} Live Products • {ideaCount} Ideas
                </div>
            </section>

            {/* ── Filters ── */}
            <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 40px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {filterTabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveFilter(tab)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "8px 20px",
                                borderRadius: 999,
                                border: activeFilter === tab
                                    ? "1px solid rgba(108,99,255,0.5)"
                                    : "1px solid rgba(255,255,255,0.1)",
                                background: activeFilter === tab
                                    ? "rgba(108,99,255,0.2)"
                                    : "rgba(255,255,255,0.04)",
                                color: activeFilter === tab ? "#a89fff" : "#777",
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.2s",
                            }}
                        >
                            {tab !== "All" && (
                                <span
                                    style={{
                                        width: 7,
                                        height: 7,
                                        borderRadius: "50%",
                                        background: STATUS_COLORS[tab]?.dot || "#555",
                                        display: "inline-block",
                                    }}
                                />
                            )}
                            {tab === "All" ? "All" : STATUS_LABELS[tab]}
                        </button>
                    ))}
                </div>
            </section>

            {/* ── Projects Grid ── */}
            <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 80px" }}>
                {filtered.length === 0 ? (
                    <div
                        style={{
                            textAlign: "center",
                            padding: "80px 24px",
                            background: "var(--color-bg-secondary)",
                            borderRadius: 20,
                            border: "1px solid var(--color-border)",
                        }}
                    >
                        <div style={{ fontSize: 56, marginBottom: 20 }}>🚧</div>
                        <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>No experiments here yet</h3>
                        <p style={{ color: "var(--color-text-secondary)" }}>Try selecting a different status filter.</p>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                            gap: 24,
                        }}
                    >
                        {filtered.map((project) => {
                            const sc = STATUS_COLORS[project.status] || STATUS_COLORS.archived;
                            return (
                                <div
                                    key={project.id}
                                    style={{
                                        background: "var(--color-bg-secondary)",
                                        border: project.is_featured
                                            ? "1px solid rgba(108,99,255,0.3)"
                                            : "1px solid rgba(255,255,255,0.07)",
                                        borderRadius: 16,
                                        overflow: "hidden",
                                        display: "flex",
                                        flexDirection: "column",
                                        position: "relative",
                                        transition: "border-color 0.3s, box-shadow 0.3s, transform 0.2s",
                                        cursor: "pointer",
                                    }}
                                    onMouseEnter={(e) => {
                                        const el = e.currentTarget as HTMLDivElement;
                                        const img = el.querySelector("img");
                                        el.style.borderColor = "rgba(108,99,255,0.5)";
                                        el.style.boxShadow = "0 0 24px rgba(108,99,255,0.15)";
                                        el.style.transform = "translateY(-4px)";
                                        if (img) img.style.transform = "scale(1.05)";
                                    }}
                                    onMouseLeave={(e) => {
                                        const el = e.currentTarget as HTMLDivElement;
                                        const img = el.querySelector("img");
                                        el.style.borderColor = project.is_featured
                                            ? "rgba(108,99,255,0.3)"
                                            : "rgba(255,255,255,0.07)";
                                        el.style.boxShadow = "none";
                                        el.style.transform = "translateY(0)";
                                        if (img) img.style.transform = "scale(1)";
                                    }}
                                    onClick={() => router.push(`/projects/${project.slug}`)}
                                >
                                    {/* Featured ribbon */}
                                    {project.is_featured && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: 14,
                                                right: -28,
                                                background: "linear-gradient(135deg, #FFD700, #FFA000)",
                                                color: "#000",
                                                fontSize: 10,
                                                fontWeight: 800,
                                                padding: "4px 36px",
                                                transform: "rotate(45deg)",
                                                transformOrigin: "center",
                                                letterSpacing: 1,
                                                textTransform: "uppercase",
                                                zIndex: 2,
                                            }}
                                        >
                                            Featured
                                        </div>
                                    )}

                                    {/* Thumbnail area */}
                                    <div
                                        style={{
                                            height: 180,
                                            background: "var(--color-bg-tertiary)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 52,
                                            overflow: "hidden",
                                            position: "relative",
                                        }}
                                    >
                                        {project.thumbnail ? (
                                            <img
                                                src={project.thumbnail}
                                                alt={project.title}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                    display: "block",
                                                    transition: "transform 0.4s ease",
                                                }}
                                            />
                                        ) : (
                                            <span style={{ fontSize: 52, opacity: 0.5 }}>🚀</span>
                                        )}
                                    </div>

                                    {/* Card content */}
                                    <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                                        {/* Status badge */}
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                            <span
                                                style={{
                                                    background: sc.bg,
                                                    color: sc.text,
                                                    borderRadius: 999,
                                                    padding: "3px 12px",
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 5,
                                                }}
                                            >
                                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc.dot, display: "inline-block" }} />
                                                {STATUS_LABELS[project.status]}
                                            </span>
                                        </div>

                                        <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--color-text-primary)", margin: "0 0 8px", lineHeight: 1.3 }}>
                                            {project.title}
                                        </h2>
                                        {project.subdomain && (
                                            <p
                                                style={{
                                                    fontSize: 12,
                                                    color: "#6C63FF",
                                                    margin: "0 0 8px",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {project.subdomain}.startup-lab.cloud
                                            </p>
                                        )}
                                        <p style={{ color: "var(--color-text-secondary)", fontSize: 14, lineHeight: 1.6, margin: "0 0 16px", flex: 1 }}>
                                            {project.description}
                                        </p>

                                        {/* Tech stack */}
                                        {project.tech_stack && project.tech_stack.length > 0 && (
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                                                {project.tech_stack.slice(0, 4).map((tech) => (
                                                    <span
                                                        key={tech}
                                                        style={{
                                                            background: "var(--color-bg-secondary)",
                                                            color: "var(--color-text-secondary)",
                                                            borderRadius: 6,
                                                            padding: "3px 10px",
                                                            fontSize: 11,
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                                {project.tech_stack.length > 4 && (
                                                    <span style={{ color: "#555", fontSize: 11, padding: "3px 0", fontWeight: 600 }}>
                                                        +{project.tech_stack.length - 4}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Action buttons */}
                                        <div style={{ display: "flex", gap: 10 }}>
                                            {project.status === "idea" && (
                                                <span
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        padding: "8px 16px",
                                                        borderRadius: 8,
                                                        background: "rgba(108,99,255,0.15)",
                                                        color: "#a89fff",
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    Coming Soon
                                                </span>
                                            )}
                                            {project.github_url && (
                                                <a
                                                    href={project.github_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 6,
                                                        padding: "8px 16px",
                                                        borderRadius: 8,
                                                        border: "1px solid var(--color-border)",
                                                        background: "var(--color-bg-secondary)",
                                                        color: "var(--color-text-secondary)",
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                        textDecoration: "none",
                                                        transition: "all 0.2s",
                                                    }}
                                                >
                                                    ⭐ GitHub
                                                </a>
                                            )}
                                            {project.live_url && (
                                                <a
                                                    href={project.live_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 6,
                                                        padding: "8px 16px",
                                                        borderRadius: 8,
                                                        border: "none",
                                                        background: "#6C63FF",
                                                        color: "#fff",
                                                        fontSize: 12,
                                                        fontWeight: 700,
                                                        textDecoration: "none",
                                                        transition: "opacity 0.2s",
                                                    }}
                                                >
                                                    🔗 Visit Site
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}

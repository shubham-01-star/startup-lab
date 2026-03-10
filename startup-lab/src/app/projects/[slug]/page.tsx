import Image from "next/image";
import Link from "next/link";
import { getDB } from "@/lib/db";
import { Project } from "@/entities/Project";
import { notFound } from "next/navigation";
import { MoreThan, Not } from "typeorm";

export const dynamic = "force-dynamic";

async function getProject(slug: string) {
    const db = await getDB();
    return db.getRepository(Project).findOne({
        where: { slug },
        relations: ["tags"],
    });
}

async function getAdjacentProject(currentSortOrder: number) {
    const db = await getDB();
    const projectRepo = db.getRepository(Project);
    const nextProject = await projectRepo.findOne({
        where: { sort_order: MoreThan(currentSortOrder) },
        order: { sort_order: "ASC" },
    });

    if (nextProject) return nextProject;

    return projectRepo.findOne({
        where: { sort_order: Not(currentSortOrder) },
        order: { sort_order: "ASC" },
    });
}

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) notFound();

    const nextProject = await getAdjacentProject(project.sort_order);

    const statusMap: Record<string, { label: string; color: string; bg: string; border: string }> = {
        live: { label: "Live", color: "#4ade80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.25)" },
        in_progress: { label: "Building", color: "#60a5fa", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.25)" },
        idea: { label: "Idea", color: "#facc15", bg: "rgba(250,204,21,0.1)", border: "rgba(250,204,21,0.25)" },
        archived: { label: "Archived", color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.25)" },
    };
    const status = statusMap[project.status] || statusMap.idea;

    // Derive a category label from the first tag or status
    const categoryLabel = project.tags?.[0]?.name?.toUpperCase() || project.status.replace("_", " ").toUpperCase();
    const contentSections = project.content?.split("\n\n").filter(Boolean) ?? [];
    const featureLines = project.content?.split("\n").filter((line) => line.trim().startsWith("-")).slice(0, 4) ?? [];
    const formatMonthYear = (value?: string | Date) => {
        if (!value) return null;
        return new Date(value).toLocaleDateString("en-US", { month: "short", year: "numeric" });
    };
    const createdLabel = formatMonthYear(project.created_at);
    const updatedLabel = formatMonthYear(project.updated_at);
    const timeline = [
        createdLabel ? { date: createdLabel, label: "Idea", detail: "Project concept entered the lab." } : null,
        createdLabel ? { date: createdLabel, label: "Prototype", detail: "Initial build and product direction took shape." } : null,
        project.status === "live"
            ? { date: updatedLabel ?? createdLabel ?? "Recently", label: "Live Launch", detail: "Shipped as a live internet product." }
            : project.status === "in_progress"
                ? { date: updatedLabel ?? createdLabel ?? "Recently", label: "Building", detail: "Currently iterating toward launch." }
                : project.status === "idea"
                    ? { date: updatedLabel ?? createdLabel ?? "Next", label: "Coming Next", detail: "Queued for validation and build." }
                    : { date: updatedLabel ?? createdLabel ?? "Archived", label: "Archived", detail: "Paused after the active build cycle." },
    ].filter((item): item is { date: string; label: string; detail: string } => Boolean(item));

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');

                .proj-detail * {
                    box-sizing: border-box;
                    font-family: 'Inter', sans-serif;
                }

                .glassmorphism {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    transition: border-color 0.3s ease;
                }

                .glassmorphism:hover {
                    border-color: rgba(108, 99, 255, 0.5);
                }

                .msym {
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

                .hero-cta-primary {
                    background: #6C63FF;
                    color: #fff;
                    border: none;
                    cursor: pointer;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .hero-cta-primary:hover {
                    transform: scale(1.05);
                    box-shadow: 0 8px 32px rgba(108,99,255,0.35);
                }
                .hero-cta-secondary {
                    background: transparent;
                    color: #fff;
                    border: 1px solid rgba(255,255,255,0.2);
                    cursor: pointer;
                    transition: background 0.2s ease;
                }
                .hero-cta-secondary:hover {
                    background: rgba(255,255,255,0.07);
                }

                .next-up-link h2 {
                    transition: color 0.25s ease;
                }
                .next-up-link:hover h2 {
                    color: #6C63FF;
                }
                .next-up-arrow {
                    opacity: 0;
                    transform: translateY(8px);
                    transition: opacity 0.25s ease, transform 0.25s ease;
                }
                .next-up-link:hover .next-up-arrow {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>

            <div className="proj-detail" style={{ background: "#0a0a0a", minHeight: "100vh", color: "#f1f5f9" }}>

                {/* ── Main ── */}
                <main style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: 1152, margin: "0 auto", width: "100%", padding: "112px 24px 80px" }}>

                    {/* Back link */}
                    <Link
                        href="/projects"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            color: "#64748b",
                            fontSize: 14,
                            textDecoration: "none",
                            marginBottom: 32,
                            transition: "color 0.2s",
                        }}
                    >
                        <span className="msym" style={{ fontSize: 18 }}>arrow_back</span>
                        Back to Projects
                    </Link>

                    {/* ── Hero Section ── */}
                    <section style={{ marginBottom: 80 }}>
                        <div
                            style={{
                                position: "relative",
                                borderRadius: 24,
                                overflow: "hidden",
                                border: "1px solid rgba(255,255,255,0.08)",
                                boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
                            }}
                        >
                            {/* Cover image / placeholder */}
                            {project.thumbnail ? (
                                <div
                                    style={{
                                        position: "relative",
                                        width: "100%",
                                        aspectRatio: "21/9",
                                    }}
                                >
                                    <Image
                                        src={project.thumbnail}
                                        alt={project.title}
                                        fill
                                        sizes="(max-width: 1200px) 100vw, 1152px"
                                        style={{
                                            objectFit: "cover",
                                        }}
                                    />
                                </div>
                            ) : (
                                <div
                                    style={{
                                        width: "100%",
                                        aspectRatio: "21/9",
                                        background: "linear-gradient(135deg, #0d0b1e 0%, #0a1220 50%, #0d0b1e 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <span className="msym" style={{ fontSize: 96, color: "rgba(108,99,255,0.2)" }}>terminal</span>
                                </div>
                            )}

                            {/* Gradient overlay */}
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    background: "linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.5) 50%, transparent 100%)",
                                }}
                            />

                            {/* Overlaid content */}
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    padding: "clamp(24px, 5vw, 48px)",
                                    width: "100%",
                                }}
                            >
                                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                    {/* Category badge */}
                                    <div
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 8,
                                            padding: "4px 14px",
                                            borderRadius: 9999,
                                            background: "rgba(108,99,255,0.2)",
                                            border: "1px solid rgba(108,99,255,0.3)",
                                            color: "#6C63FF",
                                            fontSize: 11,
                                            fontWeight: 700,
                                            letterSpacing: "0.1em",
                                            textTransform: "uppercase",
                                            width: "fit-content",
                                        }}
                                    >
                                        {categoryLabel}
                                    </div>

                                    <div
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 6,
                                            background: status.bg,
                                            color: status.color,
                                            border: `1px solid ${status.border}`,
                                            padding: "4px 12px",
                                            borderRadius: 999,
                                            fontSize: 12,
                                            fontWeight: 600,
                                            width: "fit-content",
                                        }}
                                    >
                                        <span
                                            style={{
                                                width: 7,
                                                height: 7,
                                                borderRadius: "50%",
                                                background: status.color,
                                                display: "inline-block",
                                            }}
                                        />
                                        {status.label}
                                    </div>

                                    {/* Title */}
                                    <h1
                                        style={{
                                            fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
                                            fontWeight: 900,
                                            color: "#fff",
                                            margin: 0,
                                            lineHeight: 1.05,
                                            letterSpacing: "-0.03em",
                                        }}
                                    >
                                        {project.title}
                                    </h1>

                                    {project.subdomain && (
                                        <p
                                            style={{
                                                color: "#8b82ff",
                                                fontSize: 13,
                                                fontWeight: 700,
                                                margin: 0,
                                                letterSpacing: "0.04em",
                                            }}
                                        >
                                            {project.subdomain}.startup-lab.cloud
                                        </p>
                                    )}

                                    {/* Description */}
                                    <p
                                        style={{
                                            color: "#cbd5e1",
                                            fontSize: "clamp(15px, 2vw, 18px)",
                                            maxWidth: 600,
                                            fontWeight: 300,
                                            lineHeight: 1.6,
                                            margin: 0,
                                        }}
                                    >
                                        {project.description}
                                    </p>

                                    {/* CTA buttons */}
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 8 }}>
                                        {project.live_url && (
                                            <a
                                                href={project.live_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ textDecoration: "none" }}
                                            >
                                                <button
                                                    className="hero-cta-primary"
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 8,
                                                        padding: "14px 28px",
                                                        borderRadius: 16,
                                                        fontSize: 15,
                                                        fontWeight: 700,
                                                        fontFamily: "'Inter', sans-serif",
                                                    }}
                                                >
                                                    <span className="msym" style={{ fontSize: 20 }}>rocket_launch</span>
                                                    View Live Demo
                                                </button>
                                            </a>
                                        )}
                                        {project.github_url && (
                                            <a
                                                href={project.github_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ textDecoration: "none" }}
                                            >
                                                <button
                                                    className="hero-cta-secondary"
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 8,
                                                        padding: "14px 28px",
                                                        borderRadius: 16,
                                                        fontSize: 15,
                                                        fontWeight: 700,
                                                        fontFamily: "'Inter', sans-serif",
                                                    }}
                                                >
                                                    <span className="msym" style={{ fontSize: 20 }}>code</span>
                                                    GitHub Repository
                                                </button>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── Timeline ── */}
                    <section style={{ marginBottom: 80 }}>
                        <h2
                            style={{
                                fontSize: 28,
                                fontWeight: 700,
                                color: "#fff",
                                marginBottom: 32,
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                            }}
                        >
                            <span className="msym" style={{ fontSize: 28, color: "#6C63FF" }}>timeline</span>
                            Project Timeline
                        </h2>

                        <div
                            style={{
                                display: "grid",
                                gap: 16,
                            }}
                        >
                            {timeline.map((item) => (
                                <div
                                    key={`${item.date}-${item.label}`}
                                    className="glassmorphism"
                                    style={{
                                        borderRadius: 18,
                                        padding: "20px 24px",
                                        display: "grid",
                                        gridTemplateColumns: "minmax(110px, 160px) 1fr",
                                        gap: 18,
                                        alignItems: "start",
                                    }}
                                >
                                    <div style={{ color: "#8b82ff", fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                        {item.date}
                                    </div>
                                    <div>
                                        <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 6px" }}>
                                            {item.label}
                                        </h3>
                                        <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.65, margin: 0 }}>
                                            {item.detail}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── Problem & Solution ── */}
                    {project.content && (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                                gap: 48,
                                marginBottom: 80,
                            }}
                        >
                            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <span className="msym" style={{ fontSize: 24, color: "#f87171" }}>report_problem</span>
                                    <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>The Problem</h2>
                                </div>
                                <p style={{ color: "#94a3b8", lineHeight: 1.75, fontSize: 16, margin: 0 }}>
                                    {contentSections[0] || project.description}
                                </p>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <span className="msym" style={{ fontSize: 24, color: "#4ade80" }}>check_circle</span>
                                    <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: 0 }}>The Solution</h2>
                                </div>
                                <p style={{ color: "#94a3b8", lineHeight: 1.75, fontSize: 16, margin: 0 }}>
                                    {contentSections[1] || project.content}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ── Technical Deep Dive ── */}
                    {project.tech_stack && project.tech_stack.length > 0 && (
                        <section style={{ marginBottom: 80 }}>
                            <h2
                                style={{
                                    fontSize: 28,
                                    fontWeight: 700,
                                    color: "#fff",
                                    marginBottom: 40,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                }}
                            >
                                <span className="msym" style={{ fontSize: 28, color: "#6C63FF" }}>analytics</span>
                                Technical Deep Dive
                            </h2>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                                    gap: 24,
                                }}
                            >
                                {/* Architecture card */}
                                <div className="glassmorphism" style={{ padding: 32, borderRadius: 16 }}>
                                    <div
                                        style={{
                                            width: 48, height: 48,
                                            background: "rgba(108,99,255,0.1)",
                                            borderRadius: 12,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            marginBottom: 24,
                                        }}
                                    >
                                        <span className="msym" style={{ fontSize: 24, color: "#6C63FF" }}>account_tree</span>
                                    </div>
                                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Architecture</h3>
                                    <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                                        {contentSections[2] || "Modern, scalable architecture designed for reliability and performance at every layer."}
                                    </p>
                                    <div
                                        style={{
                                            display: "flex", justifyContent: "center", padding: "16px",
                                            background: "rgba(255,255,255,0.02)", borderRadius: 8,
                                            border: "1px solid rgba(255,255,255,0.06)",
                                        }}
                                    >
                                        <span className="msym" style={{ fontSize: 48, color: "#334155" }}>schema</span>
                                    </div>
                                </div>

                                {/* Tech Stack card */}
                                <div className="glassmorphism" style={{ padding: 32, borderRadius: 16 }}>
                                    <div
                                        style={{
                                            width: 48, height: 48,
                                            background: "rgba(108,99,255,0.1)",
                                            borderRadius: 12,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            marginBottom: 24,
                                        }}
                                    >
                                        <span className="msym" style={{ fontSize: 24, color: "#6C63FF" }}>layers</span>
                                    </div>
                                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 24 }}>Tech Stack</h3>
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr",
                                            gap: 12,
                                        }}
                                    >
                                        {project.tech_stack.map((tech, i) => {
                                            const colors = [
                                                { bg: "rgba(74,222,128,0.15)", color: "#4ade80", label: tech.slice(0, 2).toUpperCase() },
                                                { bg: "rgba(96,165,250,0.15)", color: "#60a5fa", label: tech.slice(0, 2).toUpperCase() },
                                                { bg: "rgba(125,211,252,0.15)", color: "#7dd3fc", label: tech.slice(0, 2).toUpperCase() },
                                                { bg: "rgba(167,139,250,0.15)", color: "#a78bfa", label: tech.slice(0, 2).toUpperCase() },
                                                { bg: "rgba(251,191,36,0.15)", color: "#fbbf24", label: tech.slice(0, 2).toUpperCase() },
                                                { bg: "rgba(248,113,113,0.15)", color: "#f87171", label: tech.slice(0, 2).toUpperCase() },
                                            ];
                                            const c = colors[i % colors.length];
                                            return (
                                                <div key={tech} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#cbd5e1" }}>
                                                    <div
                                                        style={{
                                                            width: 24, height: 24,
                                                            background: c.bg,
                                                            borderRadius: 4,
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                            fontSize: 9, fontWeight: 700, color: c.color,
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        {c.label}
                                                    </div>
                                                    {tech}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Key Features card */}
                                <div className="glassmorphism" style={{ padding: 32, borderRadius: 16 }}>
                                    <div
                                        style={{
                                            width: 48, height: 48,
                                            background: "rgba(108,99,255,0.1)",
                                            borderRadius: 12,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            marginBottom: 24,
                                        }}
                                    >
                                        <span className="msym" style={{ fontSize: 24, color: "#6C63FF" }}>auto_fix_high</span>
                                    </div>
                                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 24 }}>Key Features</h3>
                                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                                        {featureLines.length > 0
                                            ? featureLines.map((feat, i) => (
                                                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                                    <span className="msym" style={{ fontSize: 18, color: "#6C63FF", flexShrink: 0 }}>auto_awesome</span>
                                                    <span style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.5 }}>{feat.replace(/^-\s*/, "")}</span>
                                                </li>
                                            ))
                                            : [
                                                { icon: "auto_awesome", text: "Built for scale and reliability from the ground up." },
                                                { icon: "security", text: "Security-first design with modern best practices." },
                                                { icon: "speed", text: "Optimized for high performance and low latency." },
                                            ].map((f, i) => (
                                                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                                    <span className="msym" style={{ fontSize: 18, color: "#6C63FF", flexShrink: 0 }}>{f.icon}</span>
                                                    <span style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.5 }}>{f.text}</span>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* ── Impact & Results ── */}
                    <section
                        className="glassmorphism"
                        style={{
                            borderRadius: 24,
                            padding: "clamp(32px, 5vw, 64px)",
                            marginBottom: 80,
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {/* Glow */}
                        <div
                            style={{
                                position: "absolute",
                                top: -80, right: -80,
                                width: 320, height: 320,
                                borderRadius: "50%",
                                background: "rgba(108,99,255,0.08)",
                                filter: "blur(80px)",
                                pointerEvents: "none",
                            }}
                        />
                        <div style={{ position: "relative", zIndex: 1, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 40 }}>
                            <div style={{ maxWidth: 400 }}>
                                <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: "0 0 12px" }}>Impact &amp; Results</h2>
                                <p style={{ color: "#94a3b8", lineHeight: 1.65, margin: 0 }}>
                                    {project.subdomain
                                        ? `Live at ${project.subdomain}.startup-lab.cloud — built to ship fast and scale further.`
                                        : "Designed for real-world impact, built with production-grade engineering standards."}
                                </p>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px 48px" }}>
                                <div>
                                    <div style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, color: "#6C63FF", lineHeight: 1 }}>
                                        {project.status === "live" ? "100%" : project.status === "in_progress" ? "WIP" : "—"}
                                    </div>
                                    <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 6 }}>
                                        {project.status === "live" ? "Production Ready" : "Status"}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, color: "#6C63FF", lineHeight: 1 }}>
                                        {project.tech_stack?.length ?? 0}+
                                    </div>
                                    <div style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 6 }}>
                                        Technologies
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── Tags ── */}
                    {project.tags && project.tags.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 80 }}>
                            {project.tags.map((tag) => (
                                <span
                                    key={tag.id}
                                    style={{
                                        padding: "6px 16px",
                                        borderRadius: 9999,
                                        background: "rgba(108,99,255,0.1)",
                                        border: "1px solid rgba(108,99,255,0.2)",
                                        color: "#a89fff",
                                        fontSize: 13,
                                        fontWeight: 500,
                                    }}
                                >
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* ── Next Up Footer ── */}
                    <footer style={{ paddingTop: 80, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                            <p
                                style={{
                                    color: "#475569",
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.2em",
                                    fontSize: 13,
                                    marginBottom: 24,
                                }}
                            >
                                Next Up
                            </p>
                            <Link href={nextProject ? `/projects/${nextProject.slug}` : "/projects"} className="next-up-link" style={{ textDecoration: "none" }}>
                                <h2
                                    style={{
                                        fontSize: "clamp(2rem, 6vw, 4rem)",
                                        fontWeight: 700,
                                        color: "#fff",
                                        margin: 0,
                                        lineHeight: 1.1,
                                    }}
                                >
                                    {nextProject ? nextProject.title : "All Projects"}
                                </h2>
                                <div
                                    className="next-up-arrow"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 8,
                                        marginTop: 16,
                                        color: "#6C63FF",
                                        fontWeight: 700,
                                        fontSize: 15,
                                    }}
                                >
                                    <span>{nextProject ? "Next Experiment" : "Explore More"}</span>
                                    <span className="msym" style={{ fontSize: 20 }}>arrow_forward</span>
                                </div>
                            </Link>
                        </div>
                    </footer>
                </main>
            </div>
        </>
    );
}

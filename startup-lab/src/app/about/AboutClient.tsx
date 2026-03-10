"use client";

import { useState } from "react";
import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

const SKILLS: Record<string, { name: string; color: string }[]> = {
    "Backend & Languages": [
        { name: "Node.js", color: "#68d391" },
        { name: "TypeScript", color: "#63b3ed" },
        { name: "PostgreSQL", color: "#76e4f7" },
        { name: "MongoDB", color: "#68d391" },
        { name: "Redis", color: "#fc8181" },
        { name: "Go", color: "#76e4f7" },
        { name: "Python", color: "#f6ad55" },
        { name: "MySQL", color: "#63b3ed" },
    ],
    "DevOps & Tools": [
        { name: "Docker", color: "#63b3ed" },
        { name: "AWS EC2/S3", color: "#f6ad55" },
        { name: "GitHub Actions", color: "#a78bfa" },
        { name: "Nginx", color: "#68d391" },
        { name: "Linux", color: "#fbd38d" },
        { name: "RabbitMQ", color: "#fc8181" },
    ],
};

interface FeaturedProject {
    id: number;
    title: string;
    slug: string;
    description: string;
    tech_stack: string[];
    subdomain?: string;
    status: "idea" | "in_progress" | "live" | "archived";
}

export default function AboutClient({
    profile,
    featuredProjects,
    projectCount,
    blogCount,
}: {
    profile: any;
    featuredProjects: FeaturedProject[];
    projectCount: number;
    blogCount: number;
}) {
    const [activeSkillTab, setActiveSkillTab] = useState("Backend & Languages");

    if (!profile) {
        return (
            <div style={{ minHeight: "100vh", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "var(--color-text-secondary)" }}>Profile not found</p>
            </div>
        );
    }

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap');
                .about-wrap * { box-sizing: border-box; font-family: 'Space Grotesk', sans-serif; }
                .about-glass {
                    background: var(--color-bg-secondary);
                    border: 1px solid var(--color-border);
                    backdrop-filter: blur(16px);
                    border-radius: 16px;
                }
                .about-glass:hover { border-color: rgba(108,99,255,0.3); }
                .social-icon-btn {
                    width: 38px; height: 38px;
                    border-radius: 50%;
                    background: var(--color-bg-secondary);
                    border: 1px solid var(--color-border);
                    display: flex; align-items: center; justify-content: center;
                    color: var(--color-text-secondary);
                    cursor: pointer;
                    text-decoration: none;
                    transition: all 0.2s;
                    font-size: 15px;
                }
                .social-icon-btn:hover {
                    background: rgba(108,99,255,0.2);
                    border-color: rgba(108,99,255,0.5);
                    color: #a89fff;
                    transform: translateY(-2px);
                }
                .skill-tab {
                    padding: 6px 18px;
                    border-radius: 999px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    border: none;
                    transition: all 0.2s;
                    font-family: 'Space Grotesk', sans-serif;
                }
                .skill-tab-active {
                    background: rgba(108,99,255,0.2);
                    color: #a89fff;
                    border: 1px solid rgba(108,99,255,0.4);
                }
                .skill-tab-inactive {
                    background: transparent;
                    color: var(--color-text-secondary);
                    border: 1px solid var(--color-border);
                }
                .skill-tag {
                    display: inline-flex; align-items: center; gap: 6px;
                    padding: 6px 14px;
                    border-radius: 999px;
                    background: var(--color-bg-secondary);
                    border: 1px solid var(--color-border);
                    font-size: 13px; font-weight: 600;
                    color: var(--color-text-secondary);
                    transition: all 0.2s;
                }
                .skill-tag:hover {
                    background: rgba(108,99,255,0.1);
                    border-color: rgba(108,99,255,0.3);
                    color: #a89fff;
                }
                .proj-card {
                    background: var(--color-bg-secondary);
                    border: 1px solid var(--color-border);
                    border-radius: 14px;
                    padding: 20px;
                    transition: all 0.25s;
                }
                .proj-card:hover {
                    border-color: rgba(108,99,255,0.4);
                    transform: translateY(-3px);
                    box-shadow: 0 8px 30px rgba(108,99,255,0.15);
                }
                .exp-entry {
                    border-left: 3px solid #6C63FF;
                    padding-left: 20px;
                    position: relative;
                    transition: border-color 0.2s;
                }
                .exp-entry:hover { border-color: #a78bfa; }
                .exp-entry::before {
                    content: '';
                    position: absolute;
                    left: -6px;
                    top: 6px;
                    width: 9px; height: 9px;
                    border-radius: 50%;
                    background: #6C63FF;
                    box-shadow: 0 0 10px rgba(108,99,255,0.8);
                }
                .dot-bg {
                    background-image: radial-gradient(rgba(108,99,255,0.08) 1px, transparent 1px);
                    background-size: 28px 28px;
                }
                @media (max-width: 768px) {
                    .about-layout { flex-direction: column !important; }
                    .about-sidebar { position: static !important; width: 100% !important; }
                }
            `}</style>

            <div
                className="about-wrap dot-bg"
                style={{ background: "transparent", minHeight: "100vh", color: "var(--color-text-primary)" }}
            >
                <div
                    className="about-layout"
                    style={{
                        maxWidth: 1120,
                        margin: "0 auto",
                        padding: "100px 24px 80px",
                        display: "flex",
                        gap: 32,
                        alignItems: "flex-start",
                    }}
                >
                    {/* ── Sticky Sidebar ── */}
                    <aside
                        className="about-sidebar"
                        style={{
                            width: 260,
                            flexShrink: 0,
                            position: "sticky",
                            top: 100,
                        }}
                    >
                        {/* Avatar */}
                        <div style={{ textAlign: "center", marginBottom: 24 }}>
                            {profile.avatar ? (
                                <img
                                    src={profile.avatar}
                                    alt={profile.name ?? "Profile"}
                                    style={{
                                        width: 110,
                                        height: 110,
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        display: "block",
                                        margin: "0 auto 18px",
                                        boxShadow: "0 0 0 4px rgba(108,99,255,0.35), 0 0 40px rgba(108,99,255,0.3)",
                                        border: "3px solid #6C63FF",
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: 110,
                                        height: 110,
                                        borderRadius: "50%",
                                        background: "linear-gradient(135deg, #6C63FF, #a78bfa)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 44,
                                        fontWeight: 800,
                                        color: "#fff",
                                        margin: "0 auto 18px",
                                        boxShadow: "0 0 0 4px rgba(108,99,255,0.25), 0 0 40px rgba(108,99,255,0.3)",
                                    }}
                                >
                                    {profile.name?.charAt(0) ?? "S"}
                                </div>
                            )}

                            <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--color-text-primary)", margin: "0 0 4px" }}>
                                {profile.name ?? "Shubham Kumar"}
                            </h1>
                            <p style={{ fontSize: 12, fontWeight: 700, color: "#6C63FF", letterSpacing: "0.07em", textTransform: "uppercase", margin: "0 0 12px" }}>
                                {profile.title ?? "Backend Software Engineer"}
                            </p>

                            {/* Location badge */}
                            {profile.location && (
                                <div
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 5,
                                        padding: "4px 14px",
                                        borderRadius: 999,
                                        background: "rgba(108,99,255,0.1)",
                                        border: "1px solid rgba(108,99,255,0.25)",
                                        color: "var(--color-text-secondary)",
                                        fontSize: 13,
                                        marginBottom: 20,
                                    }}
                                >
                                    📍 {profile.location}
                                </div>
                            )}

                            {/* Social Icons */}
                            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 24 }}>
                                {profile.github && (
                                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="GitHub">
                                        <Github size={18} />
                                    </a>
                                )}
                                {profile.linkedin && (
                                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="LinkedIn">
                                        <Linkedin size={18} />
                                    </a>
                                )}
                                {profile.email && (
                                    <a href={`mailto:${profile.email}`} className="social-icon-btn" title="Email">
                                        <Mail size={18} />
                                    </a>
                                )}
                            </div>

                            {profile.resume_url ? (
                                <a
                                    href={profile.resume_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 8,
                                        padding: "12px 0",
                                        borderRadius: 12,
                                        background: "linear-gradient(135deg, #6C63FF, #a78bfa)",
                                        color: "#fff",
                                        fontWeight: 700,
                                        fontSize: 14,
                                        textDecoration: "none",
                                        boxShadow: "0 4px 20px rgba(108,99,255,0.35)",
                                        transition: "opacity 0.2s, transform 0.2s",
                                    }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.88"; (e.currentTarget as HTMLElement).style.transform = "scale(1.03)"; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                                >
                                    ⬇ Download Resume
                                </a>
                            ) : (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 8,
                                        padding: "12px 0",
                                        borderRadius: 12,
                                        background: "linear-gradient(135deg, rgba(108,99,255,0.3), rgba(167,139,250,0.24))",
                                        color: "rgba(255,255,255,0.7)",
                                        fontWeight: 700,
                                        fontSize: 14,
                                        boxShadow: "0 4px 20px rgba(108,99,255,0.12)",
                                    }}
                                >
                                    ⬇ Resume Coming Soon
                                </div>
                            )}
                        </div>

                        <div className="about-glass" style={{ padding: "18px 20px", marginBottom: 20 }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: "#6C63FF", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 10px" }}>
                                Currently Building
                            </p>
                            <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--color-text-primary)", margin: "0 0 6px" }}>
                                Startup Lab
                            </h2>
                            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>
                                A public product laboratory for experiments, launches, and lessons from the internet.
                            </p>
                        </div>

                        <div className="about-glass" style={{ padding: "18px 20px" }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: "#6C63FF", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 12px" }}>
                                Lab Snapshot
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-secondary)" }}>🚀 {projectCount} Experiments</p>
                                <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-secondary)" }}>✍️ {blogCount} Lab Notes</p>
                                <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-secondary)" }}>💼 1.5+ Years Experience</p>
                            </div>
                        </div>
                    </aside>

                    {/* ── Main Content ── */}
                    <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 32 }}>

                        {/* About Me */}
                        <section className="about-glass" style={{ padding: "28px 32px" }}>
                            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                                <span style={{ fontSize: 18 }}>👤</span> About Me
                            </h2>
                            <p style={{ color: "var(--color-text-secondary)", fontSize: 15, lineHeight: 1.8, margin: 0 }}>
                                {profile.bio ?? (
                                    <>
                                        Backend Engineer with 1.5+ years of experience building{" "}
                                        <span style={{ color: "#a78bfa", fontWeight: 700 }}>scalable backend systems</span>,
                                        optimizing databases, and implementing robust API architectures. Passionate about{" "}
                                        <span style={{ color: "#a78bfa", fontWeight: 700 }}>system design</span> and performance optimization.
                                    </>
                                )}
                            </p>
                        </section>

                        <section className="about-glass" style={{ padding: "24px 32px" }}>
                            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
                                <span>🧠</span> Tech Philosophy
                            </h2>
                            <p style={{ color: "var(--color-text-secondary)", fontSize: 15, lineHeight: 1.8, margin: 0 }}>
                                I believe in building small experiments, shipping fast, and learning from real users.
                                Strong backend systems matter, but speed of learning matters more when turning ideas into products.
                            </p>
                        </section>

                        {/* Work Experience */}
                        {profile.experience?.length > 0 && (
                            <section>
                                <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                                    <span>🏢</span> Work Experience
                                </h2>
                                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                    {profile.experience.map((exp: any, i: number) => (
                                        <div key={i} className="exp-entry">
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                                                <div>
                                                    <p style={{ fontSize: 13, fontWeight: 700, color: "#6C63FF", margin: "0 0 3px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                                                        {exp.role}
                                                    </p>
                                                    <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--color-text-primary)", margin: 0 }}>
                                                        {exp.company}
                                                    </h3>
                                                </div>
                                                <span style={{ fontSize: 12, color: "var(--color-text-secondary)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", borderRadius: 6, padding: "3px 10px", whiteSpace: "nowrap" }}>
                                                    {exp.duration}
                                                </span>
                                            </div>
                                            {exp.highlights?.length > 0 && (
                                                <ul style={{ padding: 0, margin: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                                                    {exp.highlights.map((h: string, j: number) => (
                                                        <li key={j} style={{ fontSize: 14, color: "var(--color-text-secondary)", display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.6 }}>
                                                            <span style={{ color: "#6C63FF", flexShrink: 0, marginTop: 3 }}>▸</span>
                                                            {h}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Technical Skills */}
                        <section>
                            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
                                <span>⚡</span> Technical Skills
                            </h2>
                            {/* Tabs */}
                            <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
                                {Object.keys(SKILLS).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveSkillTab(tab)}
                                        className={`skill-tab ${activeSkillTab === tab ? "skill-tab-active" : "skill-tab-inactive"}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            {/* Skill pills */}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                                {SKILLS[activeSkillTab].map((skill) => (
                                    <span key={skill.name} className="skill-tag">
                                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: skill.color, display: "inline-block", flexShrink: 0 }} />
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* Featured Projects */}
                        <section>
                            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
                                <span>🚀</span> Experiments From The Lab
                            </h2>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
                                {featuredProjects.map((proj) => (
                                    <Link key={proj.id} href={`/projects/${proj.slug}`} style={{ textDecoration: "none" }}>
                                    <div className="proj-card">
                                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                            <div
                                                style={{
                                                    width: 38, height: 38, borderRadius: 10,
                                                    background: "rgba(108,99,255,0.15)",
                                                    border: "1px solid rgba(108,99,255,0.25)",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    fontSize: 18,
                                                }}
                                            >
                                                {proj.status === "live" ? "🚀" : proj.status === "in_progress" ? "🛠️" : proj.status === "idea" ? "🧪" : "📦"}
                                            </div>
                                            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>{proj.title}</h3>
                                        </div>
                                        <p style={{ fontSize: 13, color: "#6C63FF", fontWeight: 700, margin: "0 0 8px" }}>
                                            {proj.subdomain ? `${proj.subdomain}.startup-lab.cloud` : proj.status.replace("_", " ")}
                                        </p>
                                        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: 14 }}>{proj.description}</p>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                            {(proj.tech_stack ?? []).slice(0, 3).map((tag) => (
                                                <span key={tag} style={{ fontSize: 11, fontWeight: 600, color: "#a89fff", background: "rgba(108,99,255,0.1)", borderRadius: 6, padding: "2px 8px" }}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* Education */}
                        {profile.education?.length > 0 && (
                            <section>
                                <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
                                    <span>🎓</span> Education
                                </h2>
                                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                    {profile.education.map((edu: any, i: number) => (
                                        <div key={i} className="about-glass" style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                                            <div>
                                                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text-primary)", margin: "0 0 4px" }}>{edu.institution}</h3>
                                                <p style={{ fontSize: 14, color: "#6C63FF", fontWeight: 600, margin: "0 0 4px" }}>{edu.degree}</p>
                                                {edu.cgpa && <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0 }}>CGPA: {edu.cgpa}</p>}
                                            </div>
                                            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", borderRadius: 8, padding: "4px 14px", whiteSpace: "nowrap" }}>
                                                {edu.duration}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                    </main>
                </div>
            </div>
        </>
    );
}

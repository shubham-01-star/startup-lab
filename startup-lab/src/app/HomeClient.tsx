"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight,
    ExternalLink,
    Github,
    Code2,
    Database,
    Server,
    Container,
    Globe,
    GitBranch,
    Cpu,
    Blocks,
} from "lucide-react";

import Logo from "@/components/ui/Logo";
import {
    FadeIn,
    FadeInView,
    ScaleHover,
    StaggerContainer,
    StaggerItem,
    SlideIn,
    FloatingElement,
    GlowPulse,
} from "@/components/ui/Animations";

const techIcons = [
    { name: "JavaScript", icon: Code2, color: "#F7DF1E" },
    { name: "TypeScript", icon: Code2, color: "#3178C6" },
    { name: "Node.js", icon: Server, color: "#68A063" },
    { name: "Express", icon: Server, color: "currentColor" },
    { name: "NestJS", icon: Blocks, color: "#E0234E" },
    { name: "MySQL", icon: Database, color: "#4479A1" },
    { name: "PostgreSQL", icon: Database, color: "#336791" },
    { name: "MongoDB", icon: Database, color: "#47A248" },
    { name: "Redis", icon: Database, color: "#DC382D" },
    { name: "Docker", icon: Container, color: "#2496ED" },
    { name: "Nginx", icon: Globe, color: "#009639" },
    { name: "Git", icon: GitBranch, color: "#F05032" },
    { name: "MCP", icon: Cpu, color: "#6C63FF" },
];

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { class: string; label: string }> = {
        live: { class: "bg-success/10 text-success border border-success/20", label: "🟢 Live" },
        in_progress: { class: "bg-info/10 text-info border border-info/20", label: "🔵 Building" },
        idea: { class: "bg-warning/10 text-warning border border-warning/20", label: "🟡 Idea" },
        archived: { class: "bg-border/50 text-text-secondary border border-border", label: "⚫ Archived" },
    };
    const { class: cls, label } = config[status] || config.idea;
    return <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md ${cls}`}>{label}</span>;
}

interface HomeClientProps {
    projects: any[];
    blogs: any[];
    projectCount: number;
    launchedProjectCount: number;
    blogCount: number;
}

export default function HomeClient({ projects, blogs, projectCount, launchedProjectCount, blogCount }: HomeClientProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    return (
        <div className="min-h-screen bg-bg-primary">


            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
                {/* Animated background orbs */}
                <div className="absolute inset-0">
                    <FloatingElement duration={8}>
                        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-primary/5 rounded-full blur-3xl" />
                    </FloatingElement>
                    <FloatingElement duration={10}>
                        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-secondary/5 rounded-full blur-3xl" />
                    </FloatingElement>
                    <FloatingElement duration={12}>
                        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-accent-primary/3 rounded-full blur-3xl" />
                    </FloatingElement>
                </div>

                {/* Particle grid */}
                <div className="absolute inset-0 overflow-hidden">
                    {mounted && [...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-accent-primary/20 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                opacity: [0.2, 0.8, 0.2],
                                scale: [1, 1.5, 1],
                            }}
                            transition={{
                                duration: 3 + Math.random() * 4,
                                repeat: Infinity,
                                delay: Math.random() * 3,
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
                    <FadeIn delay={0.1}>
                        <p className="text-accent-primary text-sm font-medium tracking-wider uppercase mb-4">
                            Enter the Startup Lab 🚀
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-4">
                            Hey, I&apos;m{" "}
                            <motion.span
                                className="gradient-text"
                                animate={{
                                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                }}
                                transition={{ duration: 5, repeat: Infinity }}
                                style={{ backgroundSize: "200% 200%" }}
                            >
                                Shubham
                            </motion.span>{" "}
                            <motion.span
                                animate={{ rotate: [0, 20, -20, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                                className="inline-block"
                            >
                                👋
                            </motion.span>
                        </h1>
                    </FadeIn>

                    <FadeIn delay={0.5}>
                        <p className="text-xl text-text-secondary mb-2">
                            Backend Engineer • AI Builder • Startup Experimenter
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.7}>
                        <p className="text-accent-primary/90 text-xs md:text-sm font-semibold uppercase tracking-[0.28em] mb-4">
                            Where Ideas Become Internet Products.
                        </p>
                        <p className="text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
                            I design scalable backend systems and build AI-powered products.
                            <span className="block mt-3">
                                This is my digital playground where I build in public—every new idea gets its own live subdomain.
                            </span>
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.9}>
                        <div className="flex items-center justify-center gap-4">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href="/projects"
                                    className="gradient-btn px-8 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2"
                                >
                                    Explore The Lab
                                    <motion.span
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </motion.span>
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href="/blog"
                                    className="px-8 py-3 rounded-xl font-semibold text-sm border border-border text-text-primary hover:bg-bg-tertiary transition-all"
                                >
                                    Read Lab Notes
                                </Link>
                            </motion.div>
                        </div>
                    </FadeIn>

                    {/* Scroll indicator
                    <motion.div
                        className="absolute bottom-12 left-1/2 -translate-x-1/2"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <div className="w-6 h-10 rounded-full border-2 border-border flex justify-center pt-2">
                            <motion.div
                                className="w-1.5 h-1.5 bg-accent-primary rounded-full"
                                animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </div>
                    </motion.div>
                    */}
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 -mt-20 relative z-10">
                <div className="max-w-5xl mx-auto px-6">
                    <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4" staggerDelay={0.1}>
                        {[
                            { value: String(launchedProjectCount), label: "Projects Launched", emoji: "🚀" },
                            { value: `${projectCount}+`, label: "Ideas Tested", emoji: "🧠" },
                            { value: `${blogCount}+`, label: "Articles Written", emoji: "✍️" },
                            { value: "1", label: "Hackathons Won", emoji: "🏆" },
                        ].map((stat) => (
                            <StaggerItem key={stat.label}>
                                <ScaleHover>
                                    <div className="glass rounded-xl p-5 text-center glass-hover transition-all">
                                        <p className="text-2xl font-bold text-text-primary">{stat.emoji || ""} {stat.value}</p>
                                        <p className="text-text-secondary text-sm mt-1">{stat.label}</p>
                                    </div>
                                </ScaleHover>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </div>
            </section>

            {/* Featured Projects */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <FadeInView>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-text-primary mb-2">
                                🔬 Products From The Lab
                            </h2>
                            <p className="text-text-secondary max-w-lg mx-auto">
                                Experiments that turned into real internet products.
                            </p>
                        </div>
                    </FadeInView>

                    <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.15}>
                        {projects.map((project: any) => (
                            <StaggerItem key={project.id}>
                                <ScaleHover>
                                    <Link
                                        href={`/projects/${project.slug}`}
                                        className="relative block rounded-2xl border border-border bg-bg-secondary/40 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-accent-primary/50 hover:shadow-2xl hover:shadow-accent-primary/20 group"
                                    >
                                        {/* Image Section */}
                                        <div className="h-48 relative overflow-hidden bg-bg-tertiary">
                                            <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 z-0" />
                                            {project.thumbnail ? (
                                                <img
                                                    src={project.thumbnail}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover relative z-10 transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <>
                                                    <motion.div
                                                        className="absolute inset-0 bg-gradient-to-r from-accent-primary/10 to-transparent z-0"
                                                        animate={{ x: ["-100%", "200%"] }}
                                                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 3 }}
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center z-10 transition-transform duration-700 group-hover:scale-110">
                                                        <div className="scale-150 opacity-50">
                                                            <Logo />
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            {/* Soft gradient overlay at bottom of image */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary/90 via-bg-secondary/20 to-transparent z-20 opacity-80" />

                                            {/* Top Badges */}
                                            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-30">
                                                {project.is_featured ? (
                                                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-accent-primary/90 text-white shadow-lg backdrop-blur-md">
                                                        ⭐ Featured
                                                    </span>
                                                ) : <span />}
                                                <StatusBadge status={project.status} />
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-6 relative z-30 -mt-8">
                                            <div className="bg-bg-primary/80 backdrop-blur-xl border border-border/50 rounded-xl p-4 shadow-lg mb-4 transform transition-transform duration-500 group-hover:-translate-y-1">
                                                <h3 className="font-bold text-text-primary text-xl mb-1 group-hover:text-accent-primary transition-colors">
                                                    {project.title}
                                                </h3>
                                                <p className="text-text-secondary text-sm line-clamp-2 leading-relaxed">
                                                    {project.description}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {project.tech_stack?.slice(0, 4).map((tech: string) => (
                                                    <span key={tech} className="text-[10px] uppercase font-semibold tracking-wider px-2 py-1 rounded-md bg-bg-tertiary text-text-secondary border border-border/50">
                                                        {tech}
                                                    </span>
                                                ))}
                                                {project.tech_stack?.length > 4 && (
                                                    <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-bg-tertiary text-text-secondary border border-border/50">
                                                        +{project.tech_stack.length - 4}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                                                {project.live_url && (
                                                    <span className="text-accent-primary text-sm font-medium flex items-center gap-1.5 hover:underline group/link">
                                                        <ExternalLink className="w-4 h-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                                                        Live
                                                    </span>
                                                )}
                                                {project.github_url && (
                                                    <span className="text-text-secondary text-sm font-medium flex items-center gap-1.5 hover:text-text-primary transition-colors">
                                                        <Github className="w-4 h-4" /> Code
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                </ScaleHover>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>

                    <FadeInView delay={0.3}>
                        <div className="text-center mt-8">
                            <Link href="/projects" className="text-accent-primary text-sm font-medium hover:underline inline-flex items-center gap-1">
                                Explore All Experiments <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </FadeInView>
                </div>
            </section>

            {/* Latest Blogs */}
            <section className="py-20 bg-bg-secondary/30">
                <div className="max-w-7xl mx-auto px-6">
                    <FadeInView>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-text-primary mb-2">
                                📝 Notes From The Lab
                            </h2>
                            <p className="text-text-secondary max-w-lg mx-auto">
                                Build logs, backend notes, and lessons from shipping products on the internet.
                            </p>
                        </div>
                    </FadeInView>

                    {blogs.length > 0 ? (
                        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.15}>
                            {blogs.map((blog: any) => (
                                <StaggerItem key={blog.id}>
                                    <ScaleHover>
                                        <Link
                                            href={`/blog/${blog.slug}`}
                                            className="glass rounded-xl overflow-hidden glass-hover transition-all duration-300 group block"
                                        >
                                            <div className="h-40 bg-gradient-to-br from-accent-secondary/10 to-accent-primary/10" />
                                            <div className="p-5">
                                                <h3 className="font-bold text-text-primary mb-2 group-hover:text-accent-primary transition-colors">
                                                    {blog.title}
                                                </h3>
                                                <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                                                    {blog.excerpt}
                                                </p>
                                                <div className="flex items-center gap-3 text-text-secondary text-xs">
                                                    <span>{new Date(blog.published_at || blog.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                                    <span>·</span>
                                                    <span>{blog.read_time} min read</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </ScaleHover>
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    ) : (
                        <FadeInView>
                            <GlowPulse className="rounded-xl">
                                <div className="text-center py-12 glass rounded-xl">
                                    <motion.p
                                        className="text-5xl mb-4"
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        🚧
                                    </motion.p>
                                    <p className="text-text-primary font-bold text-lg mb-1">Lab notes coming soon!</p>
                                    <p className="text-text-secondary text-sm">
                                        Stay tuned for backend breakdowns and launch lessons.
                                    </p>
                                </div>
                            </GlowPulse>
                        </FadeInView>
                    )}

                    <FadeInView delay={0.3}>
                        <div className="text-center mt-8">
                            <Link href="/blog" className="text-accent-primary text-sm font-medium hover:underline inline-flex items-center gap-1">
                                Read All Notes <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </FadeInView>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="py-20">
                <div className="max-w-5xl mx-auto px-6">
                    <FadeInView>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-text-primary mb-2">
                                ⚡ Tech I Work With
                            </h2>
                        </div>
                    </FadeInView>

                    <StaggerContainer className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4" staggerDelay={0.05}>
                        {techIcons.map((tech) => {
                            const Icon = tech.icon;
                            return (
                                <StaggerItem key={tech.name}>
                                    <motion.div
                                        className="glass rounded-xl p-4 text-center glass-hover transition-all group cursor-default"
                                        whileHover={{ scale: 1.1, y: -8 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <motion.div
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <Icon
                                                className="w-8 h-8 mx-auto mb-2"
                                                style={{ color: tech.color }}
                                            />
                                        </motion.div>
                                        <p className="text-text-secondary text-xs">{tech.name}</p>
                                    </motion.div>
                                </StaggerItem>
                            );
                        })}
                    </StaggerContainer>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-20">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <FadeInView>
                        <h2 className="text-3xl font-bold text-text-primary mb-3">
                            📬 Let&apos;s Connect
                        </h2>
                        <p className="text-text-secondary mb-8">
                            Have a project idea, collaboration opportunity, or just want to say hi?
                        </p>
                    </FadeInView>
                    <FadeInView delay={0.2}>
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href="/contact"
                                    className="gradient-btn px-8 py-3 rounded-xl font-semibold text-sm inline-flex items-center gap-2"
                                >
                                    Get in Touch
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        </div>
                    </FadeInView>
                </div>
            </section>


        </div>
    );
}

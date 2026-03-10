import { getDB } from "@/lib/db";
import { Blog } from "@/entities/Blog";
import { Project } from "@/entities/Project";
import { ContactMessage } from "@/entities/ContactMessage";
import {
    FolderKanban,
    FileText,
    Eye,
    Mail,
    Plus,
    ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

async function getStats() {
    const db = await getDB();
    const projectCount = await db.getRepository(Project).count();
    const blogCount = await db
        .getRepository(Blog)
        .count({ where: { status: "published" } });
    const totalViews = await db
        .getRepository(Blog)
        .createQueryBuilder("blog")
        .select("SUM(blog.views)", "total")
        .getRawOne();
    const unreadMessages = await db
        .getRepository(ContactMessage)
        .count({ where: { is_read: false } });

    const recentBlogs = await db.getRepository(Blog).find({
        order: { created_at: "DESC" },
        take: 5,
        select: ["id", "title", "status", "created_at"],
    });

    const recentProjects = await db.getRepository(Project).find({
        order: { created_at: "DESC" },
        take: 5,
        select: ["id", "title", "status", "created_at"],
    });

    return {
        projectCount,
        blogCount,
        totalViews: totalViews?.total || 0,
        unreadMessages,
        recentBlogs,
        recentProjects,
    };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    const statCards = [
        {
            label: "Total Projects",
            value: stats.projectCount,
            icon: FolderKanban,
            color: "text-accent-primary",
            bg: "bg-accent-primary/10",
        },
        {
            label: "Published Blogs",
            value: stats.blogCount,
            icon: FileText,
            color: "text-accent-secondary",
            bg: "bg-accent-secondary/10",
        },
        {
            label: "Total Views",
            value: stats.totalViews.toLocaleString(),
            icon: Eye,
            color: "text-success",
            bg: "bg-success/10",
        },
        {
            label: "Unread Messages",
            value: stats.unreadMessages,
            icon: Mail,
            color: "text-error",
            bg: "bg-error/10",
        },
    ];

    return (
        <div className="animate-fade-in">
            {/* Welcome */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary">
                    Welcome back, Shubham 👋
                </h1>
                <p className="text-text-secondary mt-1">
                    Here&apos;s what&apos;s happening on your lab.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className="glass rounded-xl p-5 glass-hover transition-all duration-300"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={`p-2 rounded-lg ${stat.bg}`}>
                                    <Icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-text-primary">
                                {stat.value}
                            </p>
                            <p className="text-text-secondary text-sm mt-1">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3 mb-8">
                <Link
                    href="/admin/blogs/new"
                    className="gradient-btn px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Write New Blog
                </Link>
                <Link
                    href="/admin/projects/new"
                    className="px-5 py-2.5 rounded-lg text-sm font-medium border border-border text-text-primary hover:bg-bg-tertiary transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Project
                </Link>
                <Link
                    href="/admin/messages"
                    className="px-5 py-2.5 rounded-lg text-sm font-medium border border-border text-text-primary hover:bg-bg-tertiary transition-all flex items-center gap-2"
                >
                    <Mail className="w-4 h-4" />
                    View Messages
                </Link>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Blogs */}
                <div className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-text-primary">
                            📝 Recent Blogs
                        </h2>
                        <Link
                            href="/admin/blogs"
                            className="text-accent-primary text-sm hover:underline flex items-center gap-1"
                        >
                            View All <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {stats.recentBlogs.length > 0 ? (
                            stats.recentBlogs.map((blog) => (
                                <Link
                                    key={blog.id}
                                    href={`/admin/blogs/${blog.id}/edit`}
                                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-bg-tertiary transition-all"
                                >
                                    <span className="text-text-primary text-sm">
                                        {blog.title}
                                    </span>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full ${blog.status === "published"
                                            ? "badge-published"
                                            : "badge-draft"
                                            }`}
                                    >
                                        {blog.status}
                                    </span>
                                </Link>
                            ))
                        ) : (
                            <p className="text-text-secondary text-sm py-4 text-center">
                                No blogs yet. Write your first post!
                            </p>
                        )}
                    </div>
                </div>

                {/* Recent Projects */}
                <div className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-text-primary">
                            📁 Recent Projects
                        </h2>
                        <Link
                            href="/admin/projects"
                            className="text-accent-primary text-sm hover:underline flex items-center gap-1"
                        >
                            View All <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {stats.recentProjects.length > 0 ? (
                            stats.recentProjects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/admin/projects/${project.id}/edit`}
                                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-bg-tertiary transition-all"
                                >
                                    <span className="text-text-primary text-sm">
                                        {project.title}
                                    </span>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full ${project.status === "live"
                                            ? "badge-live"
                                            : project.status === "in_progress"
                                                ? "badge-in-progress"
                                                : project.status === "idea"
                                                    ? "badge-idea"
                                                    : "badge-archived"
                                            }`}
                                    >
                                        {project.status.replace("_", " ")}
                                    </span>
                                </Link>
                            ))
                        ) : (
                            <p className="text-text-secondary text-sm py-4 text-center">
                                No projects yet. Add your first project!
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

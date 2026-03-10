"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, Search } from "lucide-react";

export default function AdminBlogsPage() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        const res = await fetch("/api/blogs?limit=100");
        const data = await res.json();
        setBlogs(data.blogs || data);
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this blog?")) return;
        await fetch(`/api/blogs/${id}`, { method: "DELETE" });
        fetchBlogs();
    };

    const filtered = blogs.filter((blog) => {
        const matchSearch = blog.title.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" || blog.status === statusFilter;
        return matchSearch && matchStatus;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-text-secondary">Loading blogs...</div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">📝 Blogs</h1>
                    <p className="text-text-secondary text-sm mt-1">{blogs.length} total posts</p>
                </div>
                <Link
                    href="/admin/blogs/new"
                    className="gradient-btn px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> New Blog
                </Link>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                    <input
                        type="text"
                        placeholder="Search blogs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-bg-tertiary border border-border rounded-lg pl-10 pr-4 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-primary"
                    />
                </div>
                <div className="flex gap-1">
                    {["all", "draft", "published", "archived"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === s
                                    ? "bg-accent-primary/15 text-accent-primary border border-accent-primary/20"
                                    : "text-text-secondary hover:bg-bg-tertiary border border-transparent"
                                }`}
                        >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="text-left px-5 py-3 text-text-secondary text-xs uppercase tracking-wider font-medium">Title</th>
                            <th className="text-left px-5 py-3 text-text-secondary text-xs uppercase tracking-wider font-medium">Status</th>
                            <th className="text-left px-5 py-3 text-text-secondary text-xs uppercase tracking-wider font-medium">Views</th>
                            <th className="text-left px-5 py-3 text-text-secondary text-xs uppercase tracking-wider font-medium">Read Time</th>
                            <th className="text-left px-5 py-3 text-text-secondary text-xs uppercase tracking-wider font-medium">Created</th>
                            <th className="text-right px-5 py-3 text-text-secondary text-xs uppercase tracking-wider font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? (
                            filtered.map((blog) => (
                                <tr key={blog.id} className="border-b border-border/50 hover:bg-bg-tertiary/50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div>
                                            <p className="text-text-primary text-sm font-medium">{blog.title}</p>
                                            <p className="text-text-secondary text-xs mt-0.5">/blog/{blog.slug}</p>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${blog.status === "published" ? "bg-success/10 text-success border border-success/20"
                                                : blog.status === "draft" ? "bg-warning/10 text-warning border border-warning/20"
                                                    : "bg-bg-tertiary text-text-secondary border border-border"
                                            }`}>
                                            {blog.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-text-secondary text-sm">{blog.views || 0}</td>
                                    <td className="px-5 py-4 text-text-secondary text-sm">{blog.read_time || 0} min</td>
                                    <td className="px-5 py-4 text-text-secondary text-sm">
                                        {new Date(blog.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/blog/${blog.slug}`}
                                                target="_blank"
                                                className="p-1.5 rounded-lg hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors"
                                                title="View"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                href={`/admin/blogs/${blog.id}/edit`}
                                                className="p-1.5 rounded-lg hover:bg-bg-tertiary text-text-secondary hover:text-accent-primary transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(blog.id)}
                                                className="p-1.5 rounded-lg hover:bg-error/10 text-text-secondary hover:text-error transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-5 py-12 text-center text-text-secondary text-sm">
                                    {search ? "No blogs match your search." : "No blogs yet. Write your first post!"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, ExternalLink, Search } from "lucide-react";

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => { fetchProjects(); }, []);

    const fetchProjects = async () => {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(data.projects || data);
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this project?")) return;
        await fetch(`/api/projects/${id}`, { method: "DELETE" });
        fetchProjects();
    };

    const filtered = projects.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );

    const statusBadge = (s: string) => {
        const map: Record<string, string> = {
            live: "bg-success/10 text-success border-success/20",
            in_progress: "bg-accent-primary/10 text-accent-primary border-accent-primary/20",
            idea: "bg-warning/10 text-warning border-warning/20",
            archived: "bg-bg-tertiary text-text-secondary border-border",
        };
        return map[s] || map.idea;
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="text-text-secondary">Loading...</div></div>;

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">📁 Projects</h1>
                    <p className="text-text-secondary text-sm mt-1">{projects.length} total projects</p>
                </div>
                <Link href="/admin/projects/new" className="gradient-btn px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Plus className="w-4 h-4" /> New Project
                </Link>
            </div>

            <div className="relative max-w-xs mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input type="text" placeholder="Search projects..." value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-bg-tertiary border border-border rounded-lg pl-10 pr-4 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-primary" />
            </div>

            <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="text-left px-5 py-3 text-text-secondary text-xs uppercase tracking-wider font-medium">Project</th>
                            <th className="text-left px-5 py-3 text-text-secondary text-xs uppercase tracking-wider font-medium">Status</th>
                            <th className="text-left px-5 py-3 text-text-secondary text-xs uppercase tracking-wider font-medium">Featured</th>
                            <th className="text-left px-5 py-3 text-text-secondary text-xs uppercase tracking-wider font-medium">Order</th>
                            <th className="text-right px-5 py-3 text-text-secondary text-xs uppercase tracking-wider font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map((project) => (
                            <tr key={project.id} className="border-b border-border/50 hover:bg-bg-tertiary/50 transition-colors">
                                <td className="px-5 py-4">
                                    <p className="text-text-primary text-sm font-medium">{project.title}</p>
                                    <p className="text-text-secondary text-xs mt-0.5">{project.subdomain || project.slug}</p>
                                </td>
                                <td className="px-5 py-4">
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge(project.status)}`}>
                                        {project.status?.replace("_", " ")}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-sm">{project.is_featured ? "⭐" : "—"}</td>
                                <td className="px-5 py-4 text-text-secondary text-sm">{project.sort_order}</td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        {project.live_url && (
                                            <a href={project.live_url} target="_blank" className="p-1.5 rounded-lg hover:bg-bg-tertiary text-text-secondary hover:text-text-primary">
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                        <Link href={`/admin/projects/${project.id}/edit`} className="p-1.5 rounded-lg hover:bg-bg-tertiary text-text-secondary hover:text-accent-primary">
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button onClick={() => handleDelete(project.id)} className="p-1.5 rounded-lg hover:bg-error/10 text-text-secondary hover:text-error">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="px-5 py-12 text-center text-text-secondary text-sm">No projects found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

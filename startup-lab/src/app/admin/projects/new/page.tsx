"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
    const router = useRouter();
    const [tags, setTags] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        title: "", slug: "", description: "", content: "", thumbnail: "",
        tech_stack: "", live_url: "", github_url: "", subdomain: "",
        status: "idea", is_featured: false, sort_order: 0, tag_ids: [] as number[],
    });

    useEffect(() => { fetch("/api/tags").then((r) => r.json()).then(setTags); }, []);

    const autoSlug = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const payload = {
            ...form,
            tech_stack: form.tech_stack.split(",").map((s) => s.trim()).filter(Boolean),
        };
        const res = await fetch("/api/projects", {
            method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
        if (res.ok) router.push("/admin/projects"); else { alert("Failed to create"); setSaving(false); }
    };

    return (
        <div className="animate-fade-in max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
                <Link href="/admin/projects" className="p-2 rounded-lg hover:bg-bg-tertiary text-text-secondary"><ArrowLeft className="w-5 h-5" /></Link>
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Add New Project</h1>
                    <p className="text-text-secondary text-sm mt-0.5">Add a new project to your portfolio</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="glass rounded-xl p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Title *</label>
                            <input type="text" required value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value, slug: autoSlug(e.target.value) })}
                                className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary"
                                placeholder="Project Name" />
                        </div>
                        <div>
                            <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Slug</label>
                            <input type="text" value={form.slug}
                                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Description *</label>
                        <input type="text" required value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary"
                            placeholder="Short description of the project" />
                    </div>
                    <div>
                        <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Thumbnail URL</label>
                        <input type="url" value={form.thumbnail}
                            onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                            className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary"
                            placeholder="https://example.com/image.png" />
                    </div>
                    <div>
                        <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Content</label>
                        <textarea rows={10} value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                            className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary resize-none font-mono"
                            placeholder="Detailed project description in Markdown..." />
                    </div>
                    <div>
                        <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Tech Stack (comma-separated)</label>
                        <input type="text" value={form.tech_stack}
                            onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
                            className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary"
                            placeholder="Node.js, TypeScript, MySQL, Docker" />
                    </div>
                </div>

                <div className="glass rounded-xl p-6 space-y-5">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Live URL</label>
                            <input type="url" value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })}
                                className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary" placeholder="https://project.startup-lab.cloud" />
                        </div>
                        <div>
                            <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">GitHub URL</label>
                            <input type="url" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                                className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary" placeholder="https://github.com/..." />
                        </div>
                        <div>
                            <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Subdomain</label>
                            <input type="text" value={form.subdomain} onChange={(e) => setForm({ ...form, subdomain: e.target.value })}
                                className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary" placeholder="project" />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Status</label>
                            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary">
                                <option value="idea">Idea</option>
                                <option value="in_progress">In Progress</option>
                                <option value="live">Live</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Sort Order</label>
                            <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                                className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary" />
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 rounded" />
                                <span className="text-text-primary text-sm">Featured Project</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Tags</label>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag: any) => (
                                <button key={tag.id} type="button"
                                    onClick={() => {
                                        const ids = form.tag_ids.includes(tag.id) ? form.tag_ids.filter((id) => id !== tag.id) : [...form.tag_ids, tag.id];
                                        setForm({ ...form, tag_ids: ids });
                                    }}
                                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.tag_ids.includes(tag.id) ? "bg-accent-primary/15 text-accent-primary border-accent-primary/30" : "border-border text-text-secondary hover:border-accent-primary/30"}`}>
                                    {tag.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button type="submit" disabled={saving} className="gradient-btn px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50">
                        <Save className="w-4 h-4" /> {saving ? "Saving..." : "Create Project"}
                    </button>
                    <Link href="/admin/projects" className="px-6 py-2.5 rounded-lg text-sm text-text-secondary hover:text-text-primary border border-border hover:bg-bg-tertiary transition-all">Cancel</Link>
                </div>
            </form>
        </div>
    );
}

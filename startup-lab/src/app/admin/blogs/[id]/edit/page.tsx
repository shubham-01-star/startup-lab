"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [tags, setTags] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        title: "", slug: "", excerpt: "", content: "", cover_image: "",
        status: "draft", is_featured: false, tag_ids: [] as number[],
    });

    useEffect(() => {
        Promise.all([
            fetch(`/api/blogs/${id}`).then((r) => r.json()),
            fetch("/api/tags").then((r) => r.json()),
        ]).then(([blog, tagsData]) => {
            setForm({
                title: blog.title || "",
                slug: blog.slug || "",
                excerpt: blog.excerpt || "",
                content: blog.content || "",
                cover_image: blog.cover_image || "",
                status: blog.status || "draft",
                is_featured: blog.is_featured || false,
                tag_ids: blog.tags?.map((t: any) => t.id) || [],
            });
            setTags(tagsData);
            setLoading(false);
        });
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const res = await fetch(`/api/blogs/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        if (res.ok) {
            router.push("/admin/blogs");
        } else {
            alert("Failed to update blog");
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64"><div className="text-text-secondary">Loading...</div></div>;
    }

    return (
        <div className="animate-fade-in max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
                <Link href="/admin/blogs" className="p-2 rounded-lg hover:bg-bg-tertiary text-text-secondary">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Edit Blog</h1>
                    <p className="text-text-secondary text-sm mt-0.5">{form.title}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="glass rounded-xl p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Title *</label>
                            <input type="text" required value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary" />
                        </div>
                        <div>
                            <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Slug</label>
                            <input type="text" value={form.slug}
                                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Excerpt</label>
                        <input type="text" value={form.excerpt}
                            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                            className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary" />
                    </div>
                    <div>
                        <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Content *</label>
                        <textarea required rows={15} value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                            className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary resize-none font-mono" />
                    </div>
                    <div>
                        <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Cover Image</label>
                        <div className="space-y-3">
                            {/* File picker */}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onload = () => setForm({ ...form, cover_image: reader.result as string });
                                    reader.readAsDataURL(file);
                                }}
                                className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-accent-primary/10 file:text-accent-primary"
                            />
                            {/* — or paste a URL — */}
                            <input
                                type="text"
                                placeholder="…or paste an image URL"
                                value={form.cover_image.startsWith("data:") ? "" : form.cover_image}
                                onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                                className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary"
                            />
                            {/* Preview */}
                            {form.cover_image && (
                                <img
                                    src={form.cover_image}
                                    alt="Cover preview"
                                    className="w-full max-h-48 object-cover rounded-lg border border-border"
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="glass rounded-xl p-6 space-y-5">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Status</label>
                            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary">
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.is_featured}
                                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 rounded" />
                                <span className="text-text-primary text-sm">Featured Post</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Tags</label>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag: any) => (
                                <button key={tag.id} type="button"
                                    onClick={() => {
                                        const ids = form.tag_ids.includes(tag.id)
                                            ? form.tag_ids.filter((tid) => tid !== tag.id)
                                            : [...form.tag_ids, tag.id];
                                        setForm({ ...form, tag_ids: ids });
                                    }}
                                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${form.tag_ids.includes(tag.id) ? "bg-accent-primary/15 text-accent-primary border-accent-primary/30"
                                        : "border-border text-text-secondary hover:border-accent-primary/30"
                                        }`}>
                                    {tag.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button type="submit" disabled={saving}
                        className="gradient-btn px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50">
                        <Save className="w-4 h-4" /> {saving ? "Saving..." : "Update Blog"}
                    </button>
                    <Link href="/admin/blogs" className="px-6 py-2.5 rounded-lg text-sm text-text-secondary hover:text-text-primary border border-border hover:bg-bg-tertiary transition-all">Cancel</Link>
                </div>
            </form>
        </div>
    );
}

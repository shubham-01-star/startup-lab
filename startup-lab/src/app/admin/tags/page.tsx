"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Tag } from "lucide-react";

export default function AdminTagsPage() {
    const [tags, setTags] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTag, setNewTag] = useState({ name: "", color: "#8B5CF6" });
    const [creating, setCreating] = useState(false);

    useEffect(() => { fetchTags(); }, []);

    const fetchTags = async () => {
        const res = await fetch("/api/tags");
        setTags(await res.json());
        setLoading(false);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        const slug = newTag.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        const res = await fetch("/api/tags", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...newTag, slug }),
        });
        if (res.ok) {
            setNewTag({ name: "", color: "#8B5CF6" });
            fetchTags();
        }
        setCreating(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this tag?")) return;
        await fetch(`/api/tags?id=${id}`, { method: "DELETE" });
        fetchTags();
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="text-text-secondary">Loading...</div></div>;

    return (
        <div className="animate-fade-in max-w-3xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-text-primary">🏷️ Tags</h1>
                <p className="text-text-secondary text-sm mt-1">{tags.length} tags</p>
            </div>

            {/* Create Tag */}
            <form onSubmit={handleCreate} className="glass rounded-xl p-5 mb-6 flex items-end gap-4">
                <div className="flex-1">
                    <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Tag Name</label>
                    <input
                        type="text" required value={newTag.name}
                        onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                        className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary"
                        placeholder="e.g. React, DevOps, AI"
                    />
                </div>
                <div>
                    <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Color</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color" value={newTag.color}
                            onChange={(e) => setNewTag({ ...newTag, color: e.target.value })}
                            className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent"
                        />
                        <span className="text-text-secondary text-xs font-mono">{newTag.color}</span>
                    </div>
                </div>
                <button
                    type="submit" disabled={creating}
                    className="gradient-btn px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                >
                    <Plus className="w-4 h-4" /> {creating ? "Adding..." : "Add Tag"}
                </button>
            </form>

            {/* Tag List */}
            <div className="glass rounded-xl overflow-hidden">
                {tags.length > 0 ? (
                    <div className="divide-y divide-border/50">
                        {tags.map((tag) => (
                            <div key={tag.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-bg-tertiary/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: tag.color || "#8B5CF6" }} />
                                    <div>
                                        <span className="text-text-primary text-sm font-medium">{tag.name}</span>
                                        <span className="text-text-secondary text-xs ml-2">/{tag.slug}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(tag.id)}
                                    className="p-1.5 rounded-lg hover:bg-error/10 text-text-secondary hover:text-error transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-text-secondary text-sm">No tags yet. Create your first tag above!</div>
                )}
            </div>
        </div>
    );
}

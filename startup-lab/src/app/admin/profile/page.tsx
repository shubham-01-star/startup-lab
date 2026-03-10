"use client";

import { useState, useEffect } from "react";
import { Save, User } from "lucide-react";

export default function AdminProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState({
        name: "", title: "", bio: "", email: "", location: "",
        github: "", linkedin: "", twitter: "",
        avatar: "", resume_url: "",
        skills: "", experience: "", education: "",
    });

    useEffect(() => {
        fetch("/api/profile")
            .then((r) => r.json())
            .then((data) => {
                setForm({
                    name: data.name || "",
                    title: data.title || "",
                    bio: data.bio || "",
                    email: data.email || "",
                    location: data.location || "",
                    github: data.github || "",
                    linkedin: data.linkedin || "",
                    twitter: data.twitter || "",
                    avatar: data.avatar || "",
                    resume_url: data.resume_url || "",
                    skills: data.skills ? JSON.stringify(data.skills, null, 2) : "{}",
                    experience: data.experience ? JSON.stringify(data.experience, null, 2) : "[]",
                    education: data.education ? JSON.stringify(data.education, null, 2) : "[]",
                });
                setLoading(false);
            });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSaved(false);

        let skills, experience, education;
        try {
            skills = JSON.parse(form.skills);
            experience = JSON.parse(form.experience);
            education = JSON.parse(form.education);
        } catch {
            alert("Skills, Experience, ya Education mein invalid JSON hai. Check karo.");
            setSaving(false);
            return;
        }

        const res = await fetch("/api/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: form.name, title: form.title, bio: form.bio,
                email: form.email, location: form.location,
                github: form.github, linkedin: form.linkedin, twitter: form.twitter,
                avatar: form.avatar, resume_url: form.resume_url,
                skills, experience, education,
            }),
        });

        if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
        else alert("Profile update failed");
        setSaving(false);
    };

    const inputCls = "w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary";

    if (loading) return <div className="flex items-center justify-center h-64"><div className="text-text-secondary">Loading...</div></div>;

    return (
        <div className="animate-fade-in max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-accent-primary/10">
                    <User className="w-5 h-5 text-accent-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Profile</h1>
                    <p className="text-text-secondary text-sm">Manage your public profile information</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* ── Avatar + Resume ── */}
                <div className="glass rounded-xl p-6 space-y-5">
                    <h2 className="text-lg font-semibold text-text-primary border-b border-border pb-3">Profile Photo & Resume</h2>

                    {/* Avatar */}
                    <div>
                        <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Profile Photo</label>
                        <div className="flex items-start gap-4">
                            {/* Preview */}
                            <div className="shrink-0">
                                {form.avatar ? (
                                    <img src={form.avatar} alt="Avatar preview"
                                        className="w-20 h-20 rounded-full object-cover border-2 border-accent-primary/50" />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-accent-primary/20 flex items-center justify-center text-2xl font-bold text-accent-primary border-2 border-accent-primary/30">
                                        {form.name?.charAt(0) || "?"}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                {/* File picker → base64 */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const reader = new FileReader();
                                        reader.onload = () => setForm({ ...form, avatar: reader.result as string });
                                        reader.readAsDataURL(file);
                                    }}
                                    className={`${inputCls} file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-accent-primary/10 file:text-accent-primary`}
                                />
                                {/* Or paste URL */}
                                <input
                                    type="text"
                                    placeholder="…ya image URL paste karo"
                                    value={form.avatar.startsWith("data:") ? "" : form.avatar}
                                    onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                                    className={inputCls}
                                />
                                <p className="text-text-secondary text-xs">File upload karoge to base64 store hoga. Ya koi public URL paste karo.</p>
                            </div>
                        </div>
                    </div>

                    {/* Resume URL */}
                    <div>
                        <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Resume URL</label>
                        <input type="text" value={form.resume_url}
                            onChange={(e) => setForm({ ...form, resume_url: e.target.value })}
                            placeholder="https://drive.google.com/... ya /resume.pdf"
                            className={inputCls} />
                        <p className="text-text-secondary text-xs mt-1">About page pe &quot;Download Resume&quot; button is URL pe link karega.</p>
                    </div>
                </div>

                {/* ── Basic Info ── */}
                <div className="glass rounded-xl p-6 space-y-5">
                    <h2 className="text-lg font-semibold text-text-primary border-b border-border pb-3">Basic Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Full Name</label>
                            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
                        </div>
                        <div>
                            <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Title / Role</label>
                            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Bio</label>
                        <textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                            className={`${inputCls} resize-none`} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Email</label>
                            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
                        </div>
                        <div>
                            <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Location</label>
                            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputCls} />
                        </div>
                    </div>
                </div>

                {/* ── Social Links ── */}
                <div className="glass rounded-xl p-6 space-y-5">
                    <h2 className="text-lg font-semibold text-text-primary border-b border-border pb-3">Social Links</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">GitHub URL</label>
                            <input type="url" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} className={inputCls} />
                        </div>
                        <div>
                            <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">LinkedIn URL</label>
                            <input type="url" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} className={inputCls} />
                        </div>
                        <div>
                            <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Twitter URL</label>
                            <input type="url" value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} className={inputCls} />
                        </div>
                    </div>
                </div>

                {/* ── JSON Data ── */}
                <div className="glass rounded-xl p-6 space-y-5">
                    <h2 className="text-lg font-semibold text-text-primary border-b border-border pb-3">Structured Data (JSON)</h2>
                    <p className="text-text-secondary text-xs -mt-2">Ye fields JSON format mein hain. Galat JSON save karne pe error aayega.</p>

                    <div>
                        <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Experience</label>
                        <textarea rows={10} value={form.experience}
                            onChange={(e) => setForm({ ...form, experience: e.target.value })}
                            className={`${inputCls} resize-none font-mono`}
                            placeholder='[{"role": "Backend Developer", "company": "AHOM Technologies", "duration": "May 2025 – Present", "location": "Remote", "highlights": ["Built REST APIs..."]}]' />
                    </div>
                    <div>
                        <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Education</label>
                        <textarea rows={6} value={form.education}
                            onChange={(e) => setForm({ ...form, education: e.target.value })}
                            className={`${inputCls} resize-none font-mono`}
                            placeholder='[{"degree": "B.Tech CSE", "institution": "NSIT Bihta, Patna", "duration": "2020–2024", "cgpa": "7.62"}]' />
                    </div>
                    <div>
                        <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Skills</label>
                        <textarea rows={6} value={form.skills}
                            onChange={(e) => setForm({ ...form, skills: e.target.value })}
                            className={`${inputCls} resize-none font-mono`}
                            placeholder='{"languages": ["TypeScript", "Go"], "backend": ["Node.js", "PostgreSQL"]}' />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button type="submit" disabled={saving}
                        className="gradient-btn px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50">
                        <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Profile"}
                    </button>
                    {saved && <span className="text-green-400 text-sm font-medium">✓ Profile successfully updated!</span>}
                </div>
            </form>
        </div>
    );
}

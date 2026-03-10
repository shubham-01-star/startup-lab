"use client";

import { useState } from "react";
import { Settings, Save, Shield } from "lucide-react";

export default function AdminSettingsPage() {
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState({
        siteTitle: "Startup Lab",
        siteDescription: "Shubham Kumar — Backend Engineer & Builder",
        maintenanceMode: false,
        analyticsId: "",
        customDomain: "startup-lab.cloud",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaved(false);
        // Settings are stored locally for now — will integrate with SiteSettings entity
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="animate-fade-in max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-accent-primary/10">
                    <Settings className="w-5 h-5 text-accent-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
                    <p className="text-text-secondary text-sm">Configure your site settings</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* General */}
                <div className="glass rounded-xl p-6 space-y-5">
                    <h2 className="text-lg font-semibold text-text-primary border-b border-border pb-3">General</h2>
                    <div>
                        <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Site Title</label>
                        <input type="text" value={form.siteTitle}
                            onChange={(e) => setForm({ ...form, siteTitle: e.target.value })}
                            className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary" />
                    </div>
                    <div>
                        <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Site Description</label>
                        <input type="text" value={form.siteDescription}
                            onChange={(e) => setForm({ ...form, siteDescription: e.target.value })}
                            className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary" />
                    </div>
                    <div>
                        <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Custom Domain</label>
                        <input type="text" value={form.customDomain}
                            onChange={(e) => setForm({ ...form, customDomain: e.target.value })}
                            className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary" />
                    </div>
                </div>

                {/* Integrations */}
                <div className="glass rounded-xl p-6 space-y-5">
                    <h2 className="text-lg font-semibold text-text-primary border-b border-border pb-3">Integrations</h2>
                    <div>
                        <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Google Analytics ID</label>
                        <input type="text" value={form.analyticsId}
                            onChange={(e) => setForm({ ...form, analyticsId: e.target.value })}
                            className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary"
                            placeholder="G-XXXXXXXXXX" />
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="glass rounded-xl p-6 space-y-5 border border-error/20">
                    <h2 className="text-lg font-semibold text-error flex items-center gap-2 border-b border-border pb-3">
                        <Shield className="w-5 h-5" /> Danger Zone
                    </h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-text-primary text-sm font-medium">Maintenance Mode</p>
                            <p className="text-text-secondary text-xs mt-0.5">When enabled, the site shows a maintenance page to visitors</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, maintenanceMode: !form.maintenanceMode })}
                            className={`relative w-12 h-6 rounded-full transition-colors ${form.maintenanceMode ? "bg-error" : "bg-bg-tertiary border border-border"}`}
                        >
                            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${form.maintenanceMode ? "left-6" : "left-0.5"}`} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button type="submit" className="gradient-btn px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2">
                        <Save className="w-4 h-4" /> Save Settings
                    </button>
                    {saved && <span className="text-success text-sm">✓ Settings saved!</span>}
                </div>
            </form>
        </div>
    );
}

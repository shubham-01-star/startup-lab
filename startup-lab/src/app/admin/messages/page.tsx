"use client";

import { useState, useEffect } from "react";
import { Mail, MailOpen, Trash2, ChevronDown, ChevronUp } from "lucide-react";

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<number | null>(null);

    useEffect(() => { fetchMessages(); }, []);

    const fetchMessages = async () => {
        const res = await fetch("/api/contact");
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : data.messages || []);
        setLoading(false);
    };

    const handleMarkRead = async (id: number) => {
        await fetch(`/api/contact`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, is_read: true }),
        });
        fetchMessages();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this message?")) return;
        await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
        fetchMessages();
    };

    const unreadCount = messages.filter((m) => !m.is_read).length;

    if (loading) return <div className="flex items-center justify-center h-64"><div className="text-text-secondary">Loading...</div></div>;

    return (
        <div className="animate-fade-in max-w-4xl">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-text-primary">📬 Messages</h1>
                <p className="text-text-secondary text-sm mt-1">
                    {messages.length} total · {unreadCount} unread
                </p>
            </div>

            <div className="glass rounded-xl overflow-hidden">
                {messages.length > 0 ? (
                    <div className="divide-y divide-border/50">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`transition-colors ${!msg.is_read ? "bg-accent-primary/5" : ""}`}>
                                <div
                                    className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-bg-tertiary/50"
                                    onClick={() => { setExpanded(expanded === msg.id ? null : msg.id); if (!msg.is_read) handleMarkRead(msg.id); }}
                                >
                                    <div className="flex-shrink-0">
                                        {msg.is_read ? (
                                            <MailOpen className="w-5 h-5 text-text-secondary" />
                                        ) : (
                                            <Mail className="w-5 h-5 text-accent-primary" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-medium ${!msg.is_read ? "text-text-primary" : "text-text-secondary"}`}>
                                                {msg.name}
                                            </span>
                                            <span className="text-text-secondary text-xs">· {msg.email}</span>
                                        </div>
                                        <p className={`text-sm truncate ${!msg.is_read ? "text-text-primary" : "text-text-secondary"}`}>
                                            {msg.subject}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <span className="text-text-secondary text-xs">
                                            {new Date(msg.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                        </span>
                                        {!msg.is_read && (
                                            <span className="w-2 h-2 bg-accent-primary rounded-full" />
                                        )}
                                        {expanded === msg.id ? <ChevronUp className="w-4 h-4 text-text-secondary" /> : <ChevronDown className="w-4 h-4 text-text-secondary" />}
                                    </div>
                                </div>

                                {expanded === msg.id && (
                                    <div className="px-5 pb-4 pl-14">
                                        <div className="bg-bg-tertiary rounded-lg p-4 mb-3">
                                            <p className="text-text-primary text-sm whitespace-pre-wrap">{msg.message}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                                                className="gradient-btn px-4 py-1.5 rounded-lg text-xs font-medium"
                                            >
                                                Reply
                                            </a>
                                            <button
                                                onClick={() => handleDelete(msg.id)}
                                                className="px-4 py-1.5 rounded-lg text-xs text-error border border-error/20 hover:bg-error/10 transition-colors"
                                            >
                                                <Trash2 className="w-3 h-3 inline mr-1" /> Delete
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-text-secondary text-sm">No messages yet. They&apos;ll show up when someone uses the contact form.</div>
                )}
            </div>
        </div>
    );
}

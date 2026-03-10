"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, Github, Linkedin, CheckCircle, XCircle } from "lucide-react";

import {
    FadeIn,
    FadeInView,
    SlideIn,
    ScaleHover,
    GlowPulse,
} from "@/components/ui/Animations";

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", company: "" });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState<string>("Failed to send. Please try again.");
    const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "shubhamkumar990201@gmail.com";
    const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("Failed to send. Please try again.");

        if (!form.email.includes("@")) {
            setStatus("error");
            setErrorMsg("Please enter a valid email.");
            return;
        }

        if (form.message.trim().length < 20) {
            setStatus("error");
            setErrorMsg("Message must be at least 20 characters.");
            return;
        }

        setStatus("loading");
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Something went wrong");
            }

            setStatus("success");
            setForm({ name: "", email: "", subject: "", message: "", company: "" });
        } catch (error) {
            setErrorMsg(error instanceof Error ? error.message : "Failed to send. Please try again.");
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary">


            <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">
                <FadeIn>
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-text-primary mb-3">Get in Touch</h1>
                        <p className="text-text-secondary max-w-lg mx-auto">
                            Have a project idea, question, or just want to say hi? I&apos;d love to hear from you.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <SlideIn direction="left" className="lg:col-span-3">
                        <GlowPulse className="rounded-xl">
                            <form onSubmit={handleSubmit} className="glass rounded-xl p-8">
                                <input
                                    type="text"
                                    name="company"
                                    value={form.company}
                                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    className="hidden"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary transition-colors"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary transition-colors"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.subject}
                                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                        className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary transition-colors"
                                        placeholder="What's this about?"
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Message</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary transition-colors resize-none"
                                        placeholder="Your message..."
                                    />
                                </div>

                                {status === "success" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 mb-4 text-success text-sm bg-success/10 border border-success/20 rounded-lg p-3"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Message sent successfully! I&apos;ll get back to you soon.
                                    </motion.div>
                                )}
                                {status === "error" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 mb-4 text-error text-sm bg-error/10 border border-error/20 rounded-lg p-3"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        {errorMsg}
                                    </motion.div>
                                )}

                                <motion.button
                                    type="submit"
                                    disabled={status === "loading"}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full gradient-btn py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {status === "loading" ? (
                                        <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                            ⏳
                                        </motion.span>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" /> Send Message
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </GlowPulse>
                    </SlideIn>

                    <SlideIn direction="right" className="lg:col-span-2">
                        <div className="space-y-4">
                            {[
                                { icon: Mail, label: "Email", value: "shubhamkumar990201@gmail.com", href: "mailto:shubhamkumar990201@gmail.com" },
                                { icon: MapPin, label: "Location", value: "India 🇮🇳", href: undefined },
                                { icon: Github, label: "GitHub", value: "shubham-01-star", href: "https://github.com/shubham-01-star" },
                                { icon: Linkedin, label: "LinkedIn", value: "shubham-01-star", href: "https://linkedin.com/in/shubham-01-star" },
                            ].map((item) => {
                                const Icon = item.icon;
                                return (
                                    <ScaleHover key={item.label}>
                                        <div className="glass rounded-xl p-5 glass-hover transition-all">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
                                                    <Icon className="w-5 h-5 text-accent-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-text-secondary text-xs uppercase tracking-wider">{item.label}</p>
                                                    {item.href ? (
                                                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-text-primary text-sm font-medium hover:text-accent-primary transition-colors">
                                                            {item.value}
                                                        </a>
                                                    ) : (
                                                        <p className="text-text-primary text-sm font-medium">{item.value}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </ScaleHover>
                                );
                            })}

                            <FadeInView delay={0.2}>
                                <div className="glass rounded-xl p-6 text-center relative overflow-hidden group border border-success/30 bg-success/5 hover:bg-success/10 transition-colors">
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-b from-success/5 to-transparent"
                                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    />
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-center gap-3 mb-3">
                                            <motion.div
                                                className="w-3 h-3 bg-success rounded-full shadow-[0_0_10px_rgba(34,197,94,0.6)]"
                                                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.8, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                            <p className="text-text-primary text-base font-bold">Available for opportunities</p>
                                        </div>
                                        <p className="text-text-secondary text-sm">
                                            Open to full-time roles & freelance projects
                                        </p>
                                        <p className="text-xs text-text-secondary mt-2">
                                            Usually replies within 24 hours
                                        </p>
                                    </div>
                                </div>
                            </FadeInView>

                            <FadeInView delay={0.3}>
                                <div className="glass rounded-xl p-6">
                                    <p className="text-text-primary font-bold text-base mb-2">
                                        Have a startup idea?
                                    </p>
                                    <p className="text-text-secondary text-sm mb-4">
                                        Let&apos;s build it together and turn it into a real product.
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        <a
                                            href={`mailto:${contactEmail}?subject=Project Inquiry`}
                                            className="gradient-btn px-4 py-2 rounded-lg text-sm font-medium"
                                        >
                                            Project Inquiry
                                        </a>
                                        {bookingUrl && (
                                            <a
                                                href={bookingUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 rounded-lg text-sm font-medium border border-border text-text-primary hover:bg-bg-tertiary transition-colors"
                                            >
                                                Book a Call
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </FadeInView>
                        </div>
                    </SlideIn>
                </div>
            </div>


        </div>
    );
}

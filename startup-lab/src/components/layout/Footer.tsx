"use client";

import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
    const year = new Date().getFullYear();
    const quickLinks = [
        { label: "Projects", href: "/projects" },
        { label: "Blog", href: "/blog" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
    ];
    const techStack = ["Node.js", "TypeScript", "PostgreSQL", "Redis", "Docker", "AWS"];

    return (
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border-t border-border py-10 mt-20"
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                    <div className="max-w-xl">
                        <p className="text-text-primary text-sm font-medium">
                            © {year} Shubham Kumar · startup-lab.cloud
                        </p>
                        <p className="text-text-secondary text-sm mt-2">
                            Backend Systems · AI Agents · Distributed Systems
                        </p>
                        <p className="text-text-secondary text-sm mt-1">
                            Building in public at startup-lab.cloud
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {techStack.map((tech) => (
                                <span
                                    key={tech}
                                    className="px-2.5 py-1 rounded-full border border-border text-xs text-text-secondary bg-bg-secondary/60"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 md:items-end">
                        <div className="flex flex-wrap gap-4 md:justify-end">
                            {quickLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            {[
                                { icon: Github, href: "https://github.com/shubham-01-star" },
                                { icon: Linkedin, href: "https://linkedin.com/in/shubham-01-star" },
                                { icon: Mail, href: "mailto:shubhamkumar990201@gmail.com" },
                            ].map((link, i) => {
                                const Icon = link.icon;
                                return (
                                    <motion.a
                                        key={i}
                                        href={link.href}
                                        target={link.href.startsWith("http") ? "_blank" : undefined}
                                        rel="noopener noreferrer"
                                        className="text-text-secondary hover:text-text-primary transition-colors"
                                        whileHover={{ scale: 1.3, y: -3 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </motion.a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
}

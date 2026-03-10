"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import ThemeToggleButton from "@/components/ui/ThemeToggleButton";
import TerminalButton from "@/components/ui/TerminalButton";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Experiments", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const githubUrl = "https://github.com/shubham-01-star";

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 8);
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const isActiveLink = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-bg-primary/72 backdrop-blur-xl border-b border-border/40 shadow-xl shadow-black/5"
                : "bg-bg-primary/38 backdrop-blur-md border-b border-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
                <Link
                    href="/"
                    title="Where Ideas Become Internet Products"
                    className="flex items-center gap-3 text-text-primary group min-w-0"
                >
                    <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Logo />
                    </motion.div>
                    <div className="flex flex-col leading-tight min-w-0">
                        <span className="font-bold text-lg group-hover:text-accent-primary transition-colors">
                            Startup Lab
                        </span>
                        <span className="hidden xl:block text-[10px] uppercase tracking-[0.24em] text-text-secondary/80">
                            startup-lab.cloud
                        </span>
                    </div>
                </Link>

                <div className="hidden lg:flex items-center gap-6 xl:gap-8">
                    {navLinks.map((link) => {
                        const isActive = isActiveLink(link.href);
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="relative"
                            >
                                <span
                                    className={`text-sm font-medium transition-colors ${isActive ? "text-text-primary" : "text-text-secondary hover:text-accent-primary"
                                        }`}
                                >
                                    {link.name}
                                </span>
                                {isActive && (
                                    <motion.div
                                        layoutId="navbar-indicator"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                    <div className="flex items-center gap-1 border-l border-border/50 pl-4 ml-2">
                        <ThemeToggleButton />
                        <TerminalButton />
                        <motion.a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.2, rotate: 360 }}
                            transition={{ duration: 0.4 }}
                            className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors ml-1"
                            title="GitHub"
                            aria-label="GitHub profile"
                        >
                            <Github className="w-5 h-5" />
                        </motion.a>
                    </div>
                </div>

                <div className="flex items-center gap-2 lg:hidden">
                    <ThemeToggleButton />
                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen((open) => !open)}
                        className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors"
                        aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                        title={isMobileMenuOpen ? "Close menu" : "Open menu"}
                    >
                        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="lg:hidden px-4 pb-4"
                    >
                        <div className="rounded-2xl border border-border/60 bg-bg-primary/90 backdrop-blur-xl shadow-2xl shadow-black/10 overflow-hidden">
                            <div className="px-4 pt-4 pb-3 border-b border-border/50">
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-primary">
                                    Startup Lab
                                </p>
                                <p className="text-xs text-text-secondary mt-1">
                                    Where ideas become internet products.
                                </p>
                            </div>

                            <div className="p-3 flex flex-col gap-1">
                                {navLinks.map((link) => {
                                    const isActive = isActiveLink(link.href);

                                    return (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${isActive
                                                ? "bg-accent-primary/12 text-text-primary border border-accent-primary/20"
                                                : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary/70 border border-transparent"
                                                }`}
                                        >
                                            {link.name}
                                        </Link>
                                    );
                                })}
                            </div>

                            <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-border/50">
                                <div className="flex items-center gap-2">
                                    <TerminalButton />
                                    <motion.a
                                        href={githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.96 }}
                                        className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors"
                                        title="GitHub"
                                        aria-label="GitHub profile"
                                    >
                                        <Github className="w-5 h-5" />
                                    </motion.a>
                                </div>
                                <span className="text-[11px] text-text-secondary">
                                    startup-lab.cloud
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}

"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import { FadeIn, FloatingElement } from "@/components/ui/Animations";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("admin@startup-lab.cloud");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => setMounted(true), []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            setError("Invalid credentials");
            setLoading(false);
        } else {
            router.push("/admin/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0">
                <FloatingElement duration={8}>
                    <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-accent-primary/5 rounded-full blur-3xl" />
                </FloatingElement>
                <FloatingElement duration={10}>
                    <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-accent-secondary/5 rounded-full blur-3xl" />
                </FloatingElement>
            </div>

            {/* Particles */}
            {mounted && [...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-accent-primary/20 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        opacity: [0.1, 0.6, 0.1],
                        scale: [1, 2, 1],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 3,
                    }}
                />
            ))}

            <FadeIn className="relative z-10 w-full max-w-md mx-4">
                <div className="glass rounded-2xl p-8 relative overflow-hidden">
                    {/* Shimmer effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
                        animate={{ x: ["-200%", "200%"] }}
                        transition={{ duration: 4, repeat: Infinity, repeatDelay: 4 }}
                    />

                    <div className="relative z-10">
                        {/* Logo */}
                        <div className="text-center mb-8">
                            <motion.div
                                className="inline-block"
                                whileHover={{ rotate: 15, scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Logo />
                            </motion.div>
                            <h1 className="text-xl font-bold text-text-primary mt-3">Startup Lab</h1>
                            <p className="text-text-secondary text-sm">Admin Panel</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-bg-tertiary border border-border rounded-lg pl-10 pr-4 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary transition-colors"
                                        placeholder="admin@startup-lab.cloud"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-text-secondary text-xs mb-1.5 uppercase tracking-wider">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-bg-tertiary border border-border rounded-lg pl-10 pr-10 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-primary transition-colors"
                                        placeholder="Enter password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-error text-sm text-center bg-error/10 border border-error/20 rounded-lg p-2.5"
                                >
                                    {error}
                                </motion.p>
                            )}

                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full gradient-btn py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                        ⏳
                                    </motion.span>
                                ) : (
                                    <>
                                        Sign In <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        <div className="text-center mt-6">
                            <Link href="/" className="text-text-secondary text-sm hover:text-accent-primary transition-colors inline-flex items-center gap-1">
                                <ArrowLeft className="w-3 h-3" /> Back to Website
                            </Link>
                        </div>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}

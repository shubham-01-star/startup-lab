"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    LayoutDashboard,
    FileText,
    FolderKanban,
    Tags,
    Mail,
    User,
    Settings,
    LogOut,
    ExternalLink,
} from "lucide-react";
import Logo from "@/components/ui/Logo";

const sidebarItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Blogs", href: "/admin/blogs", icon: FileText },
    { name: "Projects", href: "/admin/projects", icon: FolderKanban },
    { name: "Tags", href: "/admin/tags", icon: Tags },
    { name: "Messages", href: "/admin/messages", icon: Mail },
    { name: "Profile", href: "/admin/profile", icon: User },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-[220px] bg-bg-secondary border-r border-border flex flex-col z-50">
            {/* Logo */}
            <div className="p-5 border-b border-border">
                <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-2.5 text-text-primary"
                >
                    <Logo />
                    <span className="font-bold text-lg">Startup Lab</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {sidebarItems.map((item) => {
                    const isActive =
                        pathname === item.href || pathname.startsWith(item.href + "/");
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                                    ? "bg-accent-primary/15 text-accent-primary border border-accent-primary/20"
                                    : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{item.name}</span>
                            {item.name === "Messages" && (
                                <span className="ml-auto text-xs bg-error/20 text-error px-1.5 py-0.5 rounded-full">
                                    2
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-border space-y-1">
                <button
                    onClick={() => signOut({ callbackUrl: "/admin/login" })}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:text-error hover:bg-error/10 transition-all w-full"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                </button>
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:text-accent-secondary hover:bg-bg-tertiary transition-all"
                >
                    <ExternalLink className="w-4 h-4" />
                    <span>View Site</span>
                </Link>
            </div>
        </aside>
    );
}

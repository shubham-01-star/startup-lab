"use client";

import { SessionProvider } from "next-auth/react";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SessionProvider>
            <div className="min-h-screen bg-bg-primary">
                <AdminSidebar />
                <main className="ml-[220px] min-h-screen">
                    <div className="p-8">{children}</div>
                </main>
            </div>
        </SessionProvider>
    );
}

"use client";

import Image from "next/image";

export default function Logo({ size = 55 }: { size?: number }) {
    return (
        <Image
            src="/logo-removebg-preview.png"
            alt="Startup Lab"
            width={size}
            height={size}
            priority
        />
    );
}

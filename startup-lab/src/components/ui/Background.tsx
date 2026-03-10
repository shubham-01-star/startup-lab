"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Background() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (theme === "light") {
    return (
      <div className="fixed inset-0 -z-50 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div>
      </div>
    );
  }

  // Dark Theme Background
  return (
    <div className="fixed inset-0 -z-50 h-full w-full bg-[#0a0a0f] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:6rem_4rem]">
      {/* Accent Primary Glow Top Right */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(108,99,255,0.1),transparent)]"></div>
      {/* Accent Secondary Glow Bottom Left */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_0%_100%,rgba(0,210,255,0.05),transparent)]"></div>
    </div>
  );
}

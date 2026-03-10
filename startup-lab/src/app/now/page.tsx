import Link from "next/link";

const focusItems = [
    "Building Startup Lab",
    "Learning AI Agents",
    "Working on Backend System Design",
];

export default function NowPage() {
    return (
        <div className="min-h-screen bg-bg-primary">
            <div className="max-w-4xl mx-auto px-6 pt-28 pb-20">
                <div className="glass rounded-3xl p-8 md:p-12 border border-border/60">
                    <p className="text-accent-primary text-xs font-semibold uppercase tracking-[0.28em] mb-4">
                        Live Snapshot
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
                        What I&apos;m Doing Now
                    </h1>
                    <p className="text-text-secondary max-w-2xl mb-8 leading-relaxed">
                        A quick snapshot of what currently has my attention inside Startup Lab.
                    </p>

                    <div className="grid gap-4 mb-8">
                        {focusItems.map((item) => (
                            <div
                                key={item}
                                className="rounded-2xl border border-border/50 bg-bg-secondary/60 px-5 py-4 text-text-primary font-medium"
                            >
                                {item}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/projects"
                            className="gradient-btn px-5 py-2.5 rounded-xl text-sm font-semibold"
                        >
                            Explore Experiments
                        </Link>
                        <Link
                            href="/"
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-border text-text-primary hover:bg-bg-secondary transition-colors"
                        >
                            Back Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

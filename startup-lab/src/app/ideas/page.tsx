import Link from "next/link";

const ideaItems = [
    "AI workflow tools for non-technical founders",
    "Backend-first SaaS products with simple UX",
    "Public experiments that can turn into real products",
];

export default function IdeasPage() {
    return (
        <div className="min-h-screen bg-bg-primary">
            <div className="max-w-4xl mx-auto px-6 pt-28 pb-20">
                <div className="glass rounded-3xl p-8 md:p-12 border border-border/60">
                    <p className="text-accent-primary text-xs font-semibold uppercase tracking-[0.28em] mb-4">
                        Startup Ideas
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
                        Ideas In The Queue
                    </h1>
                    <p className="text-text-secondary max-w-2xl mb-8 leading-relaxed">
                        Concepts I want to test, shape, and possibly launch from the lab.
                    </p>

                    <div className="grid gap-4 mb-8">
                        {ideaItems.map((item) => (
                            <div
                                key={item}
                                className="rounded-2xl border border-border/50 bg-bg-secondary/60 px-5 py-4 text-text-primary font-medium"
                            >
                                {item}
                            </div>
                        ))}
                    </div>

                    <Link
                        href="/projects"
                        className="gradient-btn inline-flex px-5 py-2.5 rounded-xl text-sm font-semibold"
                    >
                        Explore Current Builds
                    </Link>
                </div>
            </div>
        </div>
    );
}

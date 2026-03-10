import Link from "next/link";

const timelineItems = [
    "Started building Startup Lab as a public idea playground",
    "Shifted positioning from portfolio to product lab",
    "Documenting learnings through blog posts and live experiments",
];

export default function TimelinePage() {
    return (
        <div className="min-h-screen bg-bg-primary">
            <div className="max-w-4xl mx-auto px-6 pt-28 pb-20">
                <div className="glass rounded-3xl p-8 md:p-12 border border-border/60">
                    <p className="text-accent-primary text-xs font-semibold uppercase tracking-[0.28em] mb-4">
                        Founder Journey
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
                        Timeline
                    </h1>
                    <p className="text-text-secondary max-w-2xl mb-8 leading-relaxed">
                        A simple snapshot of how the lab and founder journey are evolving in public.
                    </p>

                    <div className="grid gap-4 mb-8">
                        {timelineItems.map((item, index) => (
                            <div
                                key={item}
                                className="rounded-2xl border border-border/50 bg-bg-secondary/60 px-5 py-4 text-text-primary font-medium"
                            >
                                {index + 1}. {item}
                            </div>
                        ))}
                    </div>

                    <Link
                        href="/now"
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-border text-text-primary hover:bg-bg-secondary transition-colors"
                    >
                        See What I&apos;m Doing Now
                    </Link>
                </div>
            </div>
        </div>
    );
}

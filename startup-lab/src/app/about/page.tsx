import { getDB } from "@/lib/db";
import { Profile } from "@/entities/Profile";
import { Project } from "@/entities/Project";
import { Blog } from "@/entities/Blog";
import AboutClient from "./AboutClient";

async function getAboutData() {
    const db = await getDB();
    const profileRepo = db.getRepository(Profile);
    const projectRepo = db.getRepository(Project);
    const blogRepo = db.getRepository(Blog);

    const [profile, featuredProjects, projectCount, blogCount] = await Promise.all([
        profileRepo.findOne({ where: { id: 1 } }),
        projectRepo.find({
            where: { is_featured: true },
            order: { sort_order: "ASC" },
            take: 3,
        }),
        projectRepo.count(),
        blogRepo.count({ where: { status: "published" } }),
    ]);

    return {
        profile: profile ? JSON.parse(JSON.stringify(profile)) : null,
        featuredProjects: JSON.parse(JSON.stringify(featuredProjects)),
        projectCount,
        blogCount,
    };
}

export default async function AboutPage() {
    const data = await getAboutData();
    return <AboutClient {...data} />;
}

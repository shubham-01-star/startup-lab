import { getDB } from "@/lib/db";
import { Project } from "@/entities/Project";
import ProjectsClient from "./ProjectsClient";

async function getProjects() {
    const db = await getDB();
    const projects = await db.getRepository(Project).find({
        order: { sort_order: "ASC" },
        relations: ["tags"],
    });
    return JSON.parse(JSON.stringify(projects));
}

export default async function ProjectsPage() {
    const projects = await getProjects();
    return <ProjectsClient projects={projects} />;
}

import { getDB } from "@/lib/db";
import { Project } from "@/entities/Project";
import { Blog } from "@/entities/Blog";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

async function getData() {
  const db = await getDB();
  const projectRepo = db.getRepository(Project);
  const blogRepo = db.getRepository(Blog);

  const [projects, blogs, projectCount, launchedProjectCount, blogCount] = await Promise.all([
    projectRepo.find({
      where: { is_featured: true },
      order: { sort_order: "ASC" },
      take: 3,
      relations: ["tags"],
    }),
    blogRepo.find({
      where: { status: "published" },
      order: { published_at: "DESC" },
      take: 3,
    }),
    projectRepo.count(),
    projectRepo.count({ where: { status: "live" } }),
    blogRepo.count({ where: { status: "published" } }),
  ]);

  return {
    projects: JSON.parse(JSON.stringify(projects)),
    blogs: JSON.parse(JSON.stringify(blogs)),
    projectCount,
    launchedProjectCount,
    blogCount,
  };
}

export default async function HomePage() {
  const data = await getData();
  return <HomeClient {...data} />;
}

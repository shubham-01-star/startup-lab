import "reflect-metadata";
import { DataSource } from "typeorm";
import bcrypt from "bcryptjs";
import { User } from "../src/entities/User";
import { Blog } from "../src/entities/Blog";
import { Project } from "../src/entities/Project";
import { Tag } from "../src/entities/Tag";
import { Profile } from "../src/entities/Profile";
import { SiteSettings } from "../src/entities/SiteSettings";
import { ContactMessage } from "../src/entities/ContactMessage";
import { loadScriptEnv } from "./load-env";

loadScriptEnv();

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "startup_lab",
    synchronize: true,
    entities: [User, Blog, Project, Tag, Profile, SiteSettings, ContactMessage],
});

async function seed() {
    console.log("🌱 Starting seed...\n");

    await AppDataSource.initialize();
    console.log("✅ Database connected\n");

    // 1. Create admin user
    const userRepo = AppDataSource.getRepository(User);
    const existingUser = await userRepo.findOne({
        where: { email: process.env.ADMIN_EMAIL || "admin@startup-lab.cloud" },
    });

    if (!existingUser) {
        const hashedPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD || "Admin@123",
            12
        );
        const admin = userRepo.create({
            name: process.env.ADMIN_NAME || "Shubham",
            email: process.env.ADMIN_EMAIL || "admin@startup-lab.cloud",
            password: hashedPassword,
            role: "admin",
            bio: "Backend Software Engineer with 1.5+ years of experience",
        });
        await userRepo.save(admin);
        console.log("✅ Admin user created:", admin.email);
    } else {
        console.log("ℹ️  Admin user already exists:", existingUser.email);
    }

    // 2. Create default tags
    const tagRepo = AppDataSource.getRepository(Tag);
    const defaultTags = [
        { name: "Node.js", slug: "nodejs", color: "#68A063" },
        { name: "TypeScript", slug: "typescript", color: "#3178C6" },
        { name: "System Design", slug: "system-design", color: "#FF6B6B" },
        { name: "DevOps", slug: "devops", color: "#326CE5" },
        { name: "Database", slug: "database", color: "#4479A1" },
        { name: "API", slug: "api", color: "#6C63FF" },
        { name: "AI", slug: "ai", color: "#FF9800" },
        { name: "Tutorial", slug: "tutorial", color: "#00E676" },
        { name: "Experience", slug: "experience", color: "#AB47BC" },
        { name: "Hackathon", slug: "hackathon", color: "#FFD700" },
        { name: "Open Source", slug: "open-source", color: "#24292E" },
        { name: "Docker", slug: "docker", color: "#2496ED" },
        { name: "MySQL", slug: "mysql", color: "#4479A1" },
        { name: "Next.js", slug: "nextjs", color: "#000000" },
        { name: "React", slug: "react", color: "#61DAFB" },
    ];

    for (const tagData of defaultTags) {
        const exists = await tagRepo.findOne({ where: { slug: tagData.slug } });
        if (!exists) {
            const tag = tagRepo.create(tagData);
            await tagRepo.save(tag);
        }
    }
    console.log("✅ Tags seeded:", defaultTags.length, "tags\n");

    // 3. Create seed projects
    const projectRepo = AppDataSource.getRepository(Project);
    const nodejsTag = await tagRepo.findOne({ where: { slug: "nodejs" } });
    const tsTag = await tagRepo.findOne({ where: { slug: "typescript" } });
    const dockerTag = await tagRepo.findOne({ where: { slug: "docker" } });
    const mysqlTag = await tagRepo.findOne({ where: { slug: "mysql" } });
    const aiTag = await tagRepo.findOne({ where: { slug: "ai" } });
    const nextjsTag = await tagRepo.findOne({ where: { slug: "nextjs" } });
    const devopsTag = await tagRepo.findOne({ where: { slug: "devops" } });

    const seedProjects = [
        {
            title: "ApiforgeX",
            slug: "apiforgex",
            description:
                "Agentic DevOps Pipeline that generates production-ready APIs from text prompts in under 60 seconds.",
            content:
                "ApiforgeX is an AI-powered backend generation tool that creates production-ready APIs from simple text prompts in under 60 seconds.\n\n## How it Works\n1. You describe your API in plain English\n2. The agentic pipeline analyzes your requirements\n3. It generates the database schema, routes, controllers, and tests\n4. Automatically deploys to Vercel via CI/CD\n\n## Key Features\n- Custom Model Context Protocol (MCP) server for AI agents to design schemas\n- Kestra workflow orchestration for multi-step code generation\n- Automated deployment with Docker and CI/CD pipelines",
            tech_stack: ["Node.js", "Kestra", "TypeScript", "MCP", "Docker", "Vercel"],
            live_url: "",
            github_url: "https://github.com/shubham-01-star/apiforgex",
            subdomain: "apiforgex",
            status: "live" as const,
            is_featured: true,
            sort_order: 1,
            tags: [nodejsTag, tsTag, dockerTag, devopsTag, aiTag].filter((t): t is Tag => t !== null),
        },
        {
            title: "ReviewEarn",
            slug: "reviewearn",
            description:
                "Video testimonial platform handling 100+ concurrent uploads with automated processing.",
            content:
                "ReviewEarn is a video testimonial platform built with Node.js microservices, designed to handle 100+ concurrent video uploads efficiently.\n\n## Key Features\n- Video upload and processing pipeline\n- Automated watermarking and compression using FFmpeg\n- Microservices architecture for scalability\n- Deployed on Linux VPS with Docker Compose and Nginx load balancing",
            tech_stack: ["Node.js", "TypeScript", "MySQL", "Docker", "FFmpeg", "Nginx"],
            live_url: "",
            github_url: "https://github.com/shubham-01-star/reviewearn",
            subdomain: "reviewearn",
            status: "live" as const,
            is_featured: true,
            sort_order: 2,
            tags: [nodejsTag, tsTag, mysqlTag, dockerTag].filter((t): t is Tag => t !== null),
        },
        {
            title: "Sherlock AI",
            slug: "sherlock-ai",
            description:
                "AI-powered email mining service that extracts and analyzes data from email accounts.",
            content:
                "Sherlock AI is an intelligent email mining service that connects to email accounts (Gmail, Outlook, IMAP) and extracts meaningful data.\n\n## Key Features\n- Multi-provider support: Gmail API, Outlook, generic IMAP\n- Chronological email processing (oldest first)\n- Attachment extraction (resumes, documents)\n- AI-powered content analysis",
            tech_stack: ["Node.js", "TypeScript", "MySQL", "TypeORM", "Gmail API", "IMAP"],
            live_url: "",
            github_url: "https://github.com/shubham-01-star/sherlock-ai",
            subdomain: "sherlock",
            status: "in_progress" as const,
            is_featured: true,
            sort_order: 3,
            tags: [nodejsTag, tsTag, mysqlTag, aiTag].filter((t): t is Tag => t !== null),
        },
        {
            title: "OpsGuard",
            slug: "opsguard",
            description:
                "AI-powered incident response bot. 🥉 3rd Place Winner at MotiaHack'25.",
            content:
                "OpsGuard is an AI-powered incident response bot built during MotiaHack'25 hackathon, where it won 3rd place.\n\n## What it Does\n- Monitors systems for incidents\n- Automatically triages and categorizes alerts\n- Suggests response actions using AI",
            tech_stack: ["Node.js", "TypeScript", "AI/LLM"],
            live_url: "",
            github_url: "https://github.com/shubham-01-star/opsguard",
            subdomain: "",
            status: "archived" as const,
            is_featured: false,
            sort_order: 4,
            tags: [nodejsTag, tsTag, aiTag].filter((t): t is Tag => t !== null),
        },
        {
            title: "Startup Lab",
            slug: "startup-lab",
            description:
                "My personal portfolio, playground, and blog platform. The very site you're browsing right now.",
            content:
                "Startup Lab is this very website — my personal digital lab where I showcase projects, write blog posts, and deploy ideas as live subdomains.",
            tech_stack: ["Next.js", "TypeScript", "Tailwind CSS", "MySQL", "TypeORM"],
            live_url: "https://startup-lab.cloud",
            github_url: "https://github.com/shubham-01-star/startup-lab",
            subdomain: "",
            status: "in_progress" as const,
            is_featured: false,
            sort_order: 5,
            tags: [nextjsTag, tsTag, mysqlTag].filter((t): t is Tag => t !== null),
        },
    ];

    for (const projectData of seedProjects) {
        const exists = await projectRepo.findOne({
            where: { slug: projectData.slug },
        });
        if (!exists) {
            const project = projectRepo.create(projectData);
            await projectRepo.save(project);
            console.log("  ✅ Project:", projectData.title);
        }
    }
    console.log("✅ Projects seeded\n");

    // 4. Create default profile
    const profileRepo = AppDataSource.getRepository(Profile);
    const existingProfile = await profileRepo.findOne({ where: { id: 1 } });

    if (!existingProfile) {
        const profile = profileRepo.create({
            id: 1,
            name: "Shubham Kumar",
            title: "Backend Software Engineer",
            bio: "Backend Software Engineer with 1.5+ years of experience in building scalable backend systems using Node.js, TypeScript, and SQL/NoSQL databases. I specialize in database management, API optimization, and writing clean, maintainable code with comprehensive unit tests.",
            github: "https://github.com/shubham-01-star",
            linkedin: "https://linkedin.com/in/shubham-01-star",
            email: "shubhamkumar990201@gmail.com",
            location: "India",
            skills: {
                languages: [
                    { name: "JavaScript (ES6+)", level: 95 },
                    { name: "TypeScript", level: 90 },
                    { name: "SQL", level: 85 },
                    { name: "Python", level: 70 },
                ],
                backend: [
                    { name: "Node.js", level: 95 },
                    { name: "Express.js", level: 90 },
                    { name: "NestJS", level: 80 },
                    { name: "REST APIs", level: 95 },
                ],
                databases: [
                    { name: "MySQL", level: 90 },
                    { name: "PostgreSQL", level: 85 },
                    { name: "MongoDB", level: 80 },
                    { name: "Redis", level: 80 },
                ],
                devops: [
                    { name: "Docker", level: 85 },
                    { name: "Nginx", level: 80 },
                    { name: "Linux VPS", level: 85 },
                    { name: "Git", level: 90 },
                ],
                ai: [
                    { name: "MCP", level: 75 },
                    { name: "LLM Integration", level: 70 },
                ],
            },
            experience: [
                {
                    company: "AHOM Technologies Private Limited",
                    role: "Backend Developer",
                    location: "Gurgaon, India (On-site)",
                    duration: "May 2025 – Present",
                    highlights: [
                        "Developed and maintained backend services using Node.js (Express.js) and TypeScript",
                        "Implemented Redis caching — reduced response time from 200ms to <50ms",
                        "Wrote comprehensive Unit Tests (Jest) for code stability",
                        "Documented and standardized APIs using Swagger/OpenAPI",
                    ],
                },
                {
                    company: "Viliyo",
                    role: "Freelance Backend Developer",
                    location: "Remote",
                    duration: "Oct 2024 – Apr 2025",
                    highlights: [
                        "Built modular microservices architecture using Node.js and TypeORM",
                        "Integrated third-party services and developed secure RESTful APIs",
                        "Designed efficient MySQL database schemas with query optimization",
                    ],
                },
            ],
            education: [
                {
                    institution: "Netaji Subhas Institute of Technology (NSIT), Bihta, Patna",
                    degree: "Bachelor of Technology in Computer Science (CSE)",
                    cgpa: "7.62",
                    duration: "Nov 2020 – Aug 2024",
                },
            ],
        });
        await profileRepo.save(profile);
        console.log("✅ Profile seeded\n");
    }

    // 5. Create default site settings
    const settingsRepo = AppDataSource.getRepository(SiteSettings);
    const existingSettings = await settingsRepo.findOne({ where: { id: 1 } });

    if (!existingSettings) {
        const settings = settingsRepo.create({
            id: 1,
            site_title: "Startup Lab — Shubham Kumar",
            site_description:
                "Backend Engineer, Builder & Open Source Contributor. Explore projects, read technical blogs, and see ideas come to life.",
            maintenance_mode: false,
        });
        await settingsRepo.save(settings);
        console.log("✅ Site settings seeded\n");
    }

    console.log("\n🎉 Seed complete!");
    await AppDataSource.destroy();
    process.exit(0);
}

seed().catch((error) => {
    console.error("❌ Seed error:", error);
    process.exit(1);
});

import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "@/entities/User";
import { Blog } from "@/entities/Blog";
import { Project } from "@/entities/Project";
import { Tag } from "@/entities/Tag";
import { Profile } from "@/entities/Profile";
import { SiteSettings } from "@/entities/SiteSettings";
import { ContactMessage } from "@/entities/ContactMessage";

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "startup_lab",
    synchronize: true,
    logging: ["error", "warn"],
    entities: [User, Blog, Project, Tag, Profile, SiteSettings, ContactMessage],
});

let initialized = false;

export async function getDB(): Promise<DataSource> {
    if (!initialized) {
        await AppDataSource.initialize();
        initialized = true;
    }
    return AppDataSource;
}

export default AppDataSource;

import "reflect-metadata";
import { DataSource } from "typeorm";
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
    port: parseInt(process.env.DB_PORT || "3306", 10),
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "startup_lab",
    synchronize: false,
    logging: ["error", "warn"],
    entities: [User, Blog, Project, Tag, Profile, SiteSettings, ContactMessage],
});

async function syncSchema() {
    console.log("Syncing database schema...");

    await AppDataSource.initialize();
    await AppDataSource.synchronize();

    console.log("Database schema synced successfully.");
    await AppDataSource.destroy();
}

syncSchema().catch(async (error) => {
    console.error("Failed to sync database schema.");
    console.error(error);

    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }

    process.exit(1);
});

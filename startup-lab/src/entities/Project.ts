import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
    JoinTable,
} from "typeorm";
import { Tag } from "./Tag";

@Entity("projects")
export class Project {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255 })
    title!: string;

    @Column({ type: "varchar", length: 255, unique: true })
    slug!: string;

    @Column({ type: "text", nullable: true })
    description!: string;

    @Column({ type: "longtext", nullable: true })
    content!: string;

    @Column({ type: "varchar", length: 500, nullable: true })
    thumbnail!: string;

    @Column({ type: "json", nullable: true })
    tech_stack!: string[];

    @Column({ type: "varchar", length: 500, nullable: true })
    live_url!: string;

    @Column({ type: "varchar", length: 500, nullable: true })
    github_url!: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    subdomain!: string;

    @Column({
        type: "enum",
        enum: ["idea", "in_progress", "live", "archived"],
        default: "idea",
    })
    status!: string;

    @Column({ type: "boolean", default: false })
    is_featured!: boolean;

    @Column({ type: "int", default: 0 })
    sort_order!: number;

    @ManyToMany(() => Tag, { cascade: true })
    @JoinTable({
        name: "project_tags",
        joinColumn: { name: "project_id" },
        inverseJoinColumn: { name: "tag_id" },
    })
    tags!: Tag[];

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}

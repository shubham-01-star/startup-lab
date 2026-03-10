import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    ManyToMany,
    JoinTable,
    JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Tag } from "./Tag";

@Entity("blogs")
export class Blog {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255 })
    title!: string;

    @Column({ type: "varchar", length: 255, unique: true })
    slug!: string;

    @Column({ type: "varchar", length: 500, nullable: true })
    excerpt!: string;

    @Column({ type: "longtext", nullable: true })
    content!: string;

    @Column({ type: "longtext", nullable: true })
    cover_image!: string;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "author_id" })
    author!: User;

    @Column({ type: "int" })
    author_id!: number;

    @Column({
        type: "enum",
        enum: ["draft", "published", "archived"],
        default: "draft",
    })
    status!: string;

    @Column({ type: "boolean", default: false })
    is_featured!: boolean;

    @Column({ type: "int", default: 0 })
    read_time!: number;

    @Column({ type: "int", default: 0 })
    views!: number;

    @ManyToMany(() => Tag, { cascade: true })
    @JoinTable({
        name: "blog_tags",
        joinColumn: { name: "blog_id" },
        inverseJoinColumn: { name: "tag_id" },
    })
    tags!: Tag[];

    @Column({ type: "timestamp", nullable: true })
    published_at!: Date;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}

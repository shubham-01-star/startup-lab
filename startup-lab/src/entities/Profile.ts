import {
    Entity,
    PrimaryColumn,
    Column,
    UpdateDateColumn,
} from "typeorm";

@Entity("profile")
export class Profile {
    @PrimaryColumn({ default: 1 })
    id!: number;

    @Column({ length: 100, nullable: true })
    name!: string;

    @Column({ length: 200, nullable: true })
    title!: string;

    @Column({ type: "text", nullable: true })
    bio!: string;

    @Column({ type: "longtext", nullable: true })
    avatar!: string;

    @Column({ length: 500, nullable: true })
    resume_url!: string;

    @Column({ length: 255, nullable: true })
    github!: string;

    @Column({ length: 255, nullable: true })
    linkedin!: string;

    @Column({ length: 255, nullable: true })
    twitter!: string;

    @Column({ length: 255, nullable: true })
    email!: string;

    @Column({ length: 200, nullable: true })
    location!: string;

    @Column({ type: "json", nullable: true })
    skills!: object;

    @Column({ type: "json", nullable: true })
    experience!: object;

    @Column({ type: "json", nullable: true })
    education!: object;

    @UpdateDateColumn()
    updated_at!: Date;
}

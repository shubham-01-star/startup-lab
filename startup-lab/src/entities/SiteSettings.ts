import {
    Entity,
    PrimaryColumn,
    Column,
    UpdateDateColumn,
} from "typeorm";

@Entity("site_settings")
export class SiteSettings {
    @PrimaryColumn({ default: 1 })
    id!: number;

    @Column({ length: 200, nullable: true })
    site_title!: string;

    @Column({ length: 500, nullable: true })
    site_description!: string;

    @Column({ length: 500, nullable: true })
    og_image!: string;

    @Column({ length: 100, nullable: true })
    analytics_id!: string;

    @Column({ default: false })
    maintenance_mode!: boolean;

    @UpdateDateColumn()
    updated_at!: Date;
}

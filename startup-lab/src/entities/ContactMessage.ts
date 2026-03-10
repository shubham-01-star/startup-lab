import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from "typeorm";

@Entity("contact_messages")
export class ContactMessage {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    name!: string;

    @Column({ length: 255 })
    email!: string;

    @Column({ length: 255 })
    subject!: string;

    @Column({ type: "text" })
    message!: string;

    @Column({ default: false })
    is_read!: boolean;

    @CreateDateColumn()
    created_at!: Date;
}

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from "typeorm";

@Entity("tags")
export class Tag {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 100, unique: true })
    name!: string;

    @Column({ type: "varchar", length: 100, unique: true })
    slug!: string;

    @Column({ type: "varchar", length: 7, nullable: true })
    color!: string;
}

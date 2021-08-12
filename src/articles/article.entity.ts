import { Optional } from "@nestjs/common";
import { User } from "src/auth/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { ArticleStatus } from "./article-status.enum";


@Entity()
export class Article extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    featrueImgUrl: string;

    @Column()
    description: string;

    @Column()
    content: string;

    @Column()
    status: ArticleStatus;

    @ManyToOne(type => User, user => user.articles, { eager: false })
    user: User;

    @Column()
    userId: number;
}

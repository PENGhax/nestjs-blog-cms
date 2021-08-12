import { IsNotEmpty, IsOptional } from "class-validator";
import { ArticleStatus } from "../article-status.enum";

export class CreateArticleDto {

    @IsNotEmpty()
    title: string;

    @IsOptional()
    featrueImgUrl: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    content: string;

    @IsOptional()
    status: ArticleStatus;
}
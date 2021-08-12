import { IsIn, IsNotEmpty, IsOptional } from "class-validator";
import { ArticleStatus } from "../article-status.enum";

export class GetArticleFilterDto {
    @IsOptional()
    @IsIn([ArticleStatus.OPEN, ArticleStatus.IN_PROGRESS, ArticleStatus.DONE])
    status: ArticleStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}
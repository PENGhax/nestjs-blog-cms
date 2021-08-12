import { EntityRepository, Repository } from "typeorm";
import { Article } from "./article.entity";
import { CreateArticleDto } from "./dto/create-article.dto";

@EntityRepository(Article)
export class ArticleRepository extends Repository<Article>{

    // async createArticle(createArticlDto: CreateArticleDto): Promise<Article>{

    // }
}
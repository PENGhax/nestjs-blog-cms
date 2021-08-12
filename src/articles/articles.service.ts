import { Body, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { NoNeedToReleaseEntityManagerError } from 'typeorm';
import { ArticleStatus } from './article-status.enum';
import { Article } from './article.entity';
import { ArticleRepository } from './article.repository';
import { CreateArticleDto } from './dto/create-article.dto';
import { GetArticleFilterDto } from './dto/get-articles-filter.dto';

@Injectable()
export class ArticlesService {
    private logger = new Logger('Article Service');
    constructor(
        @InjectRepository(ArticleRepository)
        private articlRepository: ArticleRepository,
    ) { }

    async getArticles(
        filterDto: GetArticleFilterDto,
        user: User
    ): Promise<Article[]> {
        const { status, search } = filterDto;

        const query = this.articlRepository.createQueryBuilder('article');

        query.where('article.userId = :userId', { userId: user.id })

        if (status) {
            query.andWhere('article.status = : status', { status });
        }

        if (search) {
            query.andWhere('(article.title LIKE :search OR article.description LIKE :search OR article.content LIKE :search)', { search: `%${search}%` });
        }

        try {
            const articles = await query.getMany();

            return articles;
        } catch (error) {
            this.logger.error(`Failed to get articles for user "${user.username}". Filters: ${JSON.stringify(filterDto)}`, error.stack)
            throw new InternalServerErrorException();
        }

    }

    async getArticleById(id: number, user: User): Promise<Article> {
        const found = await this.articlRepository.findOne({ where: { id, userId: user.id } });

        if (!found) {
            throw new NotFoundException(`"${id}" is not found`)
        }

        return found;
    }

    async createArticle(createArticleDto: CreateArticleDto,
        user: User): Promise<Article> {
        const { title, description, content, featrueImgUrl } = createArticleDto;

        const article = new Article();

        article.title = title;
        article.featrueImgUrl = featrueImgUrl;
        article.description = description;
        article.content = content;
        article.user = user;
        article.status = ArticleStatus.OPEN;

        try {
            await article.save();
        } catch (error) {
            this.logger.error(`Failed to create a task for user "${user.username}". Data: ${JSON.stringify(createArticleDto)}`, error.stack)
        }

        delete article.user;

        return article;
    }

    async deleteArticle(id: number, user: User): Promise<void> {
        const result = await this.articlRepository.delete({ id, userId: user.id });

        if (result.affected === 0) {
            throw new NotFoundException(`Article with ID ${id} not found.`)
        }
    }

    async updateArticle(id: number, createArticlDto: CreateArticleDto, user: User): Promise<Article> {
        const article = await this.getArticleById(id, user);

        article.title = createArticlDto.title;
        article.description = createArticlDto.description;
        article.featrueImgUrl = createArticlDto.featrueImgUrl;
        article.content = createArticlDto.content;
        article.status = createArticlDto.status;

        await article.save();
        return article;
    }
}

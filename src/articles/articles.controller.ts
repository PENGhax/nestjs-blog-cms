import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Article } from './article.entity';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { GetArticleFilterDto } from './dto/get-articles-filter.dto';

@Controller('articles')
@UseGuards(AuthGuard())
export class ArticlesController {
    private logger = new Logger('ArticlesController');

    constructor(private articlesService: ArticlesService) { }

    @Get()
    getArticles(@Query(ValidationPipe) filterDto: GetArticleFilterDto, @GetUser() user: User): Promise<Article[]> {
        this.logger.verbose(`User "${user.username}" retrieving all aritcles. Filters: ${JSON.stringify(filterDto)}`);
        return this.articlesService.getArticles(filterDto, user);
    }

    @Get('/:id')
    getArticleById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Article> {
        return this.articlesService.getArticleById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createArticle(
        @Body() createArticlDto: CreateArticleDto,
        @GetUser() user: User
    ): Promise<Article> {
        this.logger.verbose(`User ${user.username} creating a new article. Data: ${JSON.stringify(createArticlDto)}`)
        return this.articlesService.createArticle(createArticlDto, user);
    }

    @Delete('/:id')
    deleteArticle(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
        return this.articlesService.deleteArticle(id, user);
    }

    @Patch('/:id')
    updateArticle(
        @Param('id', ParseIntPipe) id: number,
        @Body() createArticleDto: CreateArticleDto,
        @GetUser() user: User
    ): Promise<Article> {
        return this.articlesService.updateArticle(id, createArticleDto, user);
    }
}

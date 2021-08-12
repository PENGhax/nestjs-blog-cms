import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { ArticleStatus } from "../article-status.enum";


export class ArticleStatusValidationPipe implements PipeTransform {
    constructor(private aritclStatus: ArticleStatus) { }

    transform(value: any) {
        value = value.toUpperCase();

        if (this.isStatusValid(value)) {
            throw new BadRequestException(`"${value}" is a invalid status`);
        }

        return value;
    }

    private isStatusValid(status: any) {
        const idx = this.aritclStatus.indexOf(status);

        return idx !== -1;
    }
}
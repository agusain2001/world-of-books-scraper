import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../entities/category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { ScraperModule } from '../scraper/scraper.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Category]),
        forwardRef(() => ScraperModule),
    ],
    controllers: [CategoryController],
    providers: [CategoryService],
    exports: [CategoryService],
})
export class CategoryModule { }

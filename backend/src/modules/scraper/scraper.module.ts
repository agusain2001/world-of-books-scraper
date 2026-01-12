import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScrapeJob } from '../../entities/scrape-job.entity';
import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';
import { NavigationModule } from '../navigation/navigation.module';
import { CategoryModule } from '../category/category.module';
import { ProductModule } from '../product/product.module';
import { ReviewModule } from '../review/review.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ScrapeJob]),
        ConfigModule,
        forwardRef(() => NavigationModule),
        forwardRef(() => CategoryModule),
        forwardRef(() => ProductModule),
        ReviewModule,
    ],
    controllers: [ScraperController],
    providers: [ScraperService],
    exports: [ScraperService],
})
export class ScraperModule { }

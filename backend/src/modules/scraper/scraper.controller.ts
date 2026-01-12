import {
    Controller,
    Get,
    Post,
    Param,
    Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ScraperService } from './scraper.service';
import { CreateScrapeJobDto, ScrapeJobResponseDto, TriggerScrapeDto } from './dto/scraper.dto';

@ApiTags('Scrape Jobs')
@Controller('api/scrape-jobs')
export class ScraperController {
    constructor(private readonly scraperService: ScraperService) { }

    @Get()
    @ApiOperation({ summary: 'Get all scrape jobs' })
    @ApiResponse({ status: 200, type: [ScrapeJobResponseDto] })
    async findAll() {
        return this.scraperService.getAllJobs();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get scrape job by ID' })
    @ApiParam({ name: 'id', description: 'Scrape job ID' })
    @ApiResponse({ status: 200, type: ScrapeJobResponseDto })
    async findById(@Param('id') id: string) {
        return this.scraperService.getJobStatus(id);
    }

    @Post('navigations')
    @ApiOperation({ summary: 'Scrape all navigations' })
    @ApiResponse({ status: 200, description: 'Navigation scrape started' })
    async scrapeNavigations(@Body() dto: TriggerScrapeDto) {
        return this.scraperService.scrapeNavigations(dto.forceRefresh);
    }

    @Post('categories')
    @ApiOperation({ summary: 'Scrape all categories' })
    @ApiResponse({ status: 200, description: 'Category scrape started' })
    async scrapeCategories(@Body() dto: TriggerScrapeDto) {
        return this.scraperService.scrapeCategories(undefined, dto.forceRefresh);
    }

    @Post('categories/:slug')
    @ApiOperation({ summary: 'Scrape specific category' })
    @ApiParam({ name: 'slug', description: 'Category slug' })
    @ApiResponse({ status: 200, description: 'Category scrape started' })
    async scrapeCategoryBySlug(
        @Param('slug') slug: string,
        @Body() dto: TriggerScrapeDto,
    ) {
        return this.scraperService.scrapeCategories(slug, dto.forceRefresh);
    }

    @Post('products/:categorySlug')
    @ApiOperation({ summary: 'Scrape products in category' })
    @ApiParam({ name: 'categorySlug', description: 'Category slug' })
    @ApiResponse({ status: 200, description: 'Product list scrape started' })
    async scrapeProducts(
        @Param('categorySlug') categorySlug: string,
        @Body() body: TriggerScrapeDto & { page?: number; limit?: number },
    ) {
        return this.scraperService.scrapeProductList(
            categorySlug,
            body.page || 1,
            body.limit || 20,
            body.forceRefresh,
        );
    }

    @Post('product-detail/:sourceId')
    @ApiOperation({ summary: 'Scrape product detail' })
    @ApiParam({ name: 'sourceId', description: 'Product source ID' })
    @ApiResponse({ status: 200, description: 'Product detail scrape started' })
    async scrapeProductDetail(
        @Param('sourceId') sourceId: string,
        @Body() dto: TriggerScrapeDto,
    ) {
        return this.scraperService.scrapeProductDetail(sourceId, dto.forceRefresh);
    }
}

import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { ScraperService } from '../scraper/scraper.service';
import {
    CreateCategoryDto,
    UpdateCategoryDto,
    CategoryResponseDto,
} from './dto/category.dto';
import { TriggerScrapeDto } from '../scraper/dto/scraper.dto';

@ApiTags('Categories')
@Controller('api/categories')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService,
        private readonly scraperService: ScraperService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    @ApiResponse({ status: 200, type: [CategoryResponseDto] })
    async findAll() {
        return this.categoryService.findAll();
    }

    @Get('tree')
    @ApiOperation({ summary: 'Get category tree (hierarchical)' })
    @ApiResponse({ status: 200, type: [CategoryResponseDto] })
    async getTree() {
        return this.categoryService.getCategoryTree();
    }

    @Get('root')
    @ApiOperation({ summary: 'Get root categories only' })
    @ApiResponse({ status: 200, type: [CategoryResponseDto] })
    async getRootCategories() {
        return this.categoryService.findRootCategories();
    }

    @Get('navigation/:navigationId')
    @ApiOperation({ summary: 'Get categories by navigation ID' })
    @ApiParam({ name: 'navigationId', description: 'Navigation ID' })
    @ApiResponse({ status: 200, type: [CategoryResponseDto] })
    async findByNavigationId(@Param('navigationId') navigationId: string) {
        return this.categoryService.findByNavigationId(navigationId);
    }

    @Get(':slug')
    @ApiOperation({ summary: 'Get category by slug' })
    @ApiParam({ name: 'slug', description: 'Category slug' })
    @ApiResponse({ status: 200, type: CategoryResponseDto })
    @ApiResponse({ status: 404, description: 'Category not found' })
    async findBySlug(@Param('slug') slug: string) {
        return this.categoryService.findBySlug(slug);
    }

    @Get(':id/subcategories')
    @ApiOperation({ summary: 'Get subcategories' })
    @ApiParam({ name: 'id', description: 'Parent category ID' })
    @ApiResponse({ status: 200, type: [CategoryResponseDto] })
    async getSubcategories(@Param('id') id: string) {
        return this.categoryService.findSubcategories(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new category' })
    @ApiResponse({ status: 201, type: CategoryResponseDto })
    async create(@Body() dto: CreateCategoryDto) {
        return this.categoryService.create(dto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a category' })
    @ApiParam({ name: 'id', description: 'Category ID' })
    @ApiResponse({ status: 200, type: CategoryResponseDto })
    @ApiResponse({ status: 404, description: 'Category not found' })
    async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
        return this.categoryService.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a category' })
    @ApiParam({ name: 'id', description: 'Category ID' })
    @ApiResponse({ status: 204, description: 'Category deleted' })
    @ApiResponse({ status: 404, description: 'Category not found' })
    async delete(@Param('id') id: string) {
        return this.categoryService.delete(id);
    }

    @Post(':slug/scrape')
    @ApiOperation({ summary: 'Trigger category scrape' })
    @ApiParam({ name: 'slug', description: 'Category slug' })
    @ApiResponse({ status: 200, description: 'Scrape started' })
    async scrape(@Param('slug') slug: string, @Body() dto: TriggerScrapeDto) {
        return this.scraperService.scrapeCategories(slug, dto.forceRefresh);
    }

    @Post('scrape')
    @ApiOperation({ summary: 'Trigger all categories scrape' })
    @ApiResponse({ status: 200, description: 'Scrape started' })
    async scrapeAll(@Body() dto: TriggerScrapeDto) {
        return this.scraperService.scrapeCategories(undefined, dto.forceRefresh);
    }
}

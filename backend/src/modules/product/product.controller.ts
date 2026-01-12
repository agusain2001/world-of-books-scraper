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
import { ProductService } from './product.service';
import { ScraperService } from '../scraper/scraper.service';
import {
    CreateProductDto,
    UpdateProductDto,
    ProductResponseDto,
    ProductQueryDto,
    PaginatedProductsDto,
} from './dto/product.dto';
import { TriggerScrapeDto } from '../scraper/dto/scraper.dto';

@ApiTags('Products')
@Controller('api/products')
export class ProductController {
    constructor(
        private readonly productService: ProductService,
        private readonly scraperService: ScraperService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Get all products with filtering and pagination' })
    @ApiResponse({ status: 200, type: PaginatedProductsDto })
    async findAll(@Query() query: ProductQueryDto) {
        return this.productService.findAll(query);
    }

    @Get('recent')
    @ApiOperation({ summary: 'Get recently added products' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, type: [ProductResponseDto] })
    async getRecent(@Query('limit') limit?: number) {
        return this.productService.getRecentProducts(limit);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product by ID' })
    @ApiParam({ name: 'id', description: 'Product ID' })
    @ApiResponse({ status: 200, type: ProductResponseDto })
    @ApiResponse({ status: 404, description: 'Product not found' })
    async findById(@Param('id') id: string) {
        return this.productService.findById(id);
    }

    @Get(':id/details')
    @ApiOperation({ summary: 'Get product details' })
    @ApiParam({ name: 'id', description: 'Product ID' })
    @ApiResponse({ status: 200, description: 'Product details' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    async getDetails(@Param('id') id: string) {
        return this.productService.getDetail(id);
    }

    @Get(':id/related')
    @ApiOperation({ summary: 'Get related products' })
    @ApiParam({ name: 'id', description: 'Product ID' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, type: [ProductResponseDto] })
    async getRelated(@Param('id') id: string, @Query('limit') limit?: number) {
        return this.productService.getRelatedProducts(id, limit);
    }

    @Get('source/:sourceId')
    @ApiOperation({ summary: 'Get product by source ID' })
    @ApiParam({ name: 'sourceId', description: 'Product source ID from World of Books' })
    @ApiResponse({ status: 200, type: ProductResponseDto })
    @ApiResponse({ status: 404, description: 'Product not found' })
    async findBySourceId(@Param('sourceId') sourceId: string) {
        const product = await this.productService.findBySourceId(sourceId);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    @Post()
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ status: 201, type: ProductResponseDto })
    async create(@Body() dto: CreateProductDto) {
        return this.productService.create(dto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a product' })
    @ApiParam({ name: 'id', description: 'Product ID' })
    @ApiResponse({ status: 200, type: ProductResponseDto })
    @ApiResponse({ status: 404, description: 'Product not found' })
    async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
        return this.productService.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a product' })
    @ApiParam({ name: 'id', description: 'Product ID' })
    @ApiResponse({ status: 204, description: 'Product deleted' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    async delete(@Param('id') id: string) {
        return this.productService.delete(id);
    }

    @Post(':id/scrape')
    @ApiOperation({ summary: 'Trigger product detail scrape' })
    @ApiParam({ name: 'id', description: 'Product ID' })
    @ApiResponse({ status: 200, description: 'Scrape started' })
    async scrapeDetail(@Param('id') id: string, @Body() dto: TriggerScrapeDto) {
        const product = await this.productService.findById(id);
        return this.scraperService.scrapeProductDetail(product.sourceId, dto.forceRefresh);
    }

    @Post('category/:categorySlug/scrape')
    @ApiOperation({ summary: 'Trigger product list scrape for category' })
    @ApiParam({ name: 'categorySlug', description: 'Category slug' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'Scrape started' })
    async scrapeProductList(
        @Param('categorySlug') categorySlug: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Body() dto?: TriggerScrapeDto,
    ) {
        return this.scraperService.scrapeProductList(
            categorySlug,
            page || 1,
            limit || 20,
            dto?.forceRefresh,
        );
    }
}

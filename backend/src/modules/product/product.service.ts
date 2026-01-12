import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { Product } from '../../entities/product.entity';
import { ProductDetail } from '../../entities/product-detail.entity';
import {
    CreateProductDto,
    UpdateProductDto,
    ProductQueryDto,
    PaginatedProductsDto,
} from './dto/product.dto';

@Injectable()
export class ProductService {
    private readonly logger = new Logger(ProductService.name);

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(ProductDetail)
        private readonly productDetailRepository: Repository<ProductDetail>,
    ) { }

    async findAll(query: ProductQueryDto): Promise<PaginatedProductsDto> {
        const {
            page = 1,
            limit = 20,
            search,
            categoryId,
            categorySlug,
            minPrice,
            maxPrice,
            author,
            condition,
            format,
            sortBy = 'createdAt',
            sortOrder = 'DESC',
        } = query;

        const queryBuilder = this.productRepository.createQueryBuilder('product');

        // Join category for filtering by slug
        queryBuilder.leftJoinAndSelect('product.category', 'category');

        // Search filter
        if (search) {
            queryBuilder.andWhere(
                '(product.title ILIKE :search OR product.author ILIKE :search)',
                { search: `%${search}%` },
            );
        }

        // Category filters
        if (categoryId) {
            queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId });
        }

        if (categorySlug) {
            queryBuilder.andWhere('category.slug = :categorySlug', { categorySlug });
        }

        // Price filters
        if (minPrice !== undefined) {
            queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
        }

        if (maxPrice !== undefined) {
            queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
        }

        // Author filter
        if (author) {
            queryBuilder.andWhere('product.author ILIKE :author', { author: `%${author}%` });
        }

        // Condition filter
        if (condition) {
            queryBuilder.andWhere('product.condition = :condition', { condition });
        }

        // Format filter
        if (format) {
            queryBuilder.andWhere('product.format = :format', { format });
        }

        // Sorting
        queryBuilder.orderBy(`product.${sortBy}`, sortOrder);

        // Pagination
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);

        const [products, total] = await queryBuilder.getManyAndCount();

        const totalPages = Math.ceil(total / limit);

        return {
            data: products,
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        };
    }

    async findById(id: string): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['category', 'detail', 'reviews'],
        });

        if (!product) {
            throw new NotFoundException(`Product with id "${id}" not found`);
        }

        return product;
    }

    async findBySourceId(sourceId: string): Promise<Product | null> {
        return this.productRepository.findOne({
            where: { sourceId },
            relations: ['category', 'detail', 'reviews'],
        });
    }

    async findBySourceUrl(sourceUrl: string): Promise<Product | null> {
        return this.productRepository.findOne({
            where: { sourceUrl },
            relations: ['category', 'detail', 'reviews'],
        });
    }

    async create(dto: CreateProductDto): Promise<Product> {
        const product = this.productRepository.create(dto);
        return this.productRepository.save(product);
    }

    async update(id: string, dto: UpdateProductDto): Promise<Product> {
        const product = await this.findById(id);
        Object.assign(product, dto);
        return this.productRepository.save(product);
    }

    async upsertBySourceId(dto: CreateProductDto): Promise<Product> {
        const existing = await this.productRepository.findOne({
            where: { sourceId: dto.sourceId },
        });

        if (existing) {
            Object.assign(existing, dto);
            existing.lastScrapedAt = new Date();
            return this.productRepository.save(existing);
        }

        const product = this.productRepository.create({
            ...dto,
            lastScrapedAt: new Date(),
        });
        return this.productRepository.save(product);
    }

    async updateDetail(
        productId: string,
        detailData: Partial<ProductDetail>,
    ): Promise<ProductDetail> {
        let detail = await this.productDetailRepository.findOne({
            where: { productId },
        });

        if (detail) {
            Object.assign(detail, detailData);
        } else {
            detail = this.productDetailRepository.create({
                ...detailData,
                productId,
            });
        }

        return this.productDetailRepository.save(detail);
    }

    async getDetail(productId: string): Promise<ProductDetail | null> {
        return this.productDetailRepository.findOne({
            where: { productId },
        });
    }

    async updateLastScraped(id: string): Promise<void> {
        await this.productRepository.update(id, { lastScrapedAt: new Date() });
    }

    async delete(id: string): Promise<void> {
        const product = await this.findById(id);
        await this.productRepository.remove(product);
    }

    async needsScraping(id: string, maxAgeHours: number = 24): Promise<boolean> {
        const product = await this.findById(id);

        if (!product.lastScrapedAt) {
            return true;
        }

        const now = new Date();
        const lastScraped = new Date(product.lastScrapedAt);
        const hoursSinceLastScrape = (now.getTime() - lastScraped.getTime()) / (1000 * 60 * 60);

        return hoursSinceLastScrape >= maxAgeHours;
    }

    async getProductsByCategory(categoryId: string, limit: number = 20): Promise<Product[]> {
        return this.productRepository.find({
            where: { categoryId },
            take: limit,
            order: { createdAt: 'DESC' },
        });
    }

    async getRecentProducts(limit: number = 10): Promise<Product[]> {
        return this.productRepository.find({
            take: limit,
            order: { createdAt: 'DESC' },
        });
    }

    async getRelatedProducts(productId: string, limit: number = 6): Promise<Product[]> {
        const product = await this.findById(productId);

        if (!product.categoryId) {
            return [];
        }

        return this.productRepository.find({
            where: { categoryId: product.categoryId },
            take: limit + 1, // Get one extra in case current product is included
            order: { createdAt: 'DESC' },
        }).then(products => products.filter(p => p.id !== productId).slice(0, limit));
    }
}

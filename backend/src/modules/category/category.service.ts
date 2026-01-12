import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
    private readonly logger = new Logger(CategoryService.name);

    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async findAll(): Promise<Category[]> {
        return this.categoryRepository.find({
            order: { order: 'ASC', title: 'ASC' },
            relations: ['children', 'navigation'],
        });
    }

    async findRootCategories(): Promise<Category[]> {
        return this.categoryRepository.find({
            where: { parentId: IsNull() },
            order: { order: 'ASC', title: 'ASC' },
            relations: ['children', 'navigation'],
        });
    }

    async findBySlug(slug: string): Promise<Category> {
        const category = await this.categoryRepository.findOne({
            where: { slug },
            relations: ['children', 'parent', 'navigation', 'products'],
        });

        if (!category) {
            throw new NotFoundException(`Category with slug "${slug}" not found`);
        }

        return category;
    }

    async findById(id: string): Promise<Category> {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: ['children', 'parent', 'navigation'],
        });

        if (!category) {
            throw new NotFoundException(`Category with id "${id}" not found`);
        }

        return category;
    }

    async findByNavigationId(navigationId: string): Promise<Category[]> {
        return this.categoryRepository.find({
            where: { navigationId, parentId: IsNull() },
            order: { order: 'ASC', title: 'ASC' },
            relations: ['children'],
        });
    }

    async findSubcategories(parentId: string): Promise<Category[]> {
        return this.categoryRepository.find({
            where: { parentId },
            order: { order: 'ASC', title: 'ASC' },
            relations: ['children'],
        });
    }

    async create(dto: CreateCategoryDto): Promise<Category> {
        const category = this.categoryRepository.create(dto);
        return this.categoryRepository.save(category);
    }

    async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
        const category = await this.findById(id);
        Object.assign(category, dto);
        return this.categoryRepository.save(category);
    }

    async upsertBySlug(dto: CreateCategoryDto): Promise<Category> {
        const existing = await this.categoryRepository.findOne({
            where: { slug: dto.slug },
        });

        if (existing) {
            Object.assign(existing, dto);
            existing.lastScrapedAt = new Date();
            return this.categoryRepository.save(existing);
        }

        const category = this.categoryRepository.create({
            ...dto,
            lastScrapedAt: new Date(),
        });
        return this.categoryRepository.save(category);
    }

    async updateProductCount(id: string, count: number): Promise<void> {
        await this.categoryRepository.update(id, { productCount: count });
    }

    async updateLastScraped(id: string): Promise<void> {
        await this.categoryRepository.update(id, { lastScrapedAt: new Date() });
    }

    async delete(id: string): Promise<void> {
        const category = await this.findById(id);
        await this.categoryRepository.remove(category);
    }

    async needsScraping(id: string, maxAgeHours: number = 24): Promise<boolean> {
        const category = await this.findById(id);

        if (!category.lastScrapedAt) {
            return true;
        }

        const now = new Date();
        const lastScraped = new Date(category.lastScrapedAt);
        const hoursSinceLastScrape = (now.getTime() - lastScraped.getTime()) / (1000 * 60 * 60);

        return hoursSinceLastScrape >= maxAgeHours;
    }

    async getCategoryTree(): Promise<Category[]> {
        const categories = await this.categoryRepository.find({
            where: { parentId: IsNull() },
            relations: ['children', 'children.children'],
            order: { order: 'ASC', title: 'ASC' },
        });

        return categories;
    }
}

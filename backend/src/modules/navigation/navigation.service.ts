import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Navigation } from '../../entities/navigation.entity';
import { CreateNavigationDto, UpdateNavigationDto } from './dto/navigation.dto';

@Injectable()
export class NavigationService {
    private readonly logger = new Logger(NavigationService.name);

    constructor(
        @InjectRepository(Navigation)
        private readonly navigationRepository: Repository<Navigation>,
    ) { }

    async findAll(): Promise<Navigation[]> {
        return this.navigationRepository.find({
            order: { order: 'ASC' },
            relations: ['categories'],
        });
    }

    async findBySlug(slug: string): Promise<Navigation> {
        const navigation = await this.navigationRepository.findOne({
            where: { slug },
            relations: ['categories', 'categories.children'],
        });

        if (!navigation) {
            throw new NotFoundException(`Navigation with slug "${slug}" not found`);
        }

        return navigation;
    }

    async findById(id: string): Promise<Navigation> {
        const navigation = await this.navigationRepository.findOne({
            where: { id },
            relations: ['categories'],
        });

        if (!navigation) {
            throw new NotFoundException(`Navigation with id "${id}" not found`);
        }

        return navigation;
    }

    async create(dto: CreateNavigationDto): Promise<Navigation> {
        const navigation = this.navigationRepository.create(dto);
        return this.navigationRepository.save(navigation);
    }

    async update(id: string, dto: UpdateNavigationDto): Promise<Navigation> {
        const navigation = await this.findById(id);
        Object.assign(navigation, dto);
        return this.navigationRepository.save(navigation);
    }

    async upsertBySlug(dto: CreateNavigationDto): Promise<Navigation> {
        const existing = await this.navigationRepository.findOne({
            where: { slug: dto.slug },
        });

        if (existing) {
            Object.assign(existing, dto);
            existing.lastScrapedAt = new Date();
            return this.navigationRepository.save(existing);
        }

        const navigation = this.navigationRepository.create({
            ...dto,
            lastScrapedAt: new Date(),
        });
        return this.navigationRepository.save(navigation);
    }

    async updateLastScraped(id: string): Promise<void> {
        await this.navigationRepository.update(id, { lastScrapedAt: new Date() });
    }

    async delete(id: string): Promise<void> {
        const navigation = await this.findById(id);
        await this.navigationRepository.remove(navigation);
    }

    async needsScraping(id: string, maxAgeHours: number = 24): Promise<boolean> {
        const navigation = await this.findById(id);

        if (!navigation.lastScrapedAt) {
            return true;
        }

        const now = new Date();
        const lastScraped = new Date(navigation.lastScrapedAt);
        const hoursSinceLastScrape = (now.getTime() - lastScraped.getTime()) / (1000 * 60 * 60);

        return hoursSinceLastScrape >= maxAgeHours;
    }
}

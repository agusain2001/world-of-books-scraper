import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ViewHistory } from '../../entities/view-history.entity';
import { CreateViewHistoryDto } from './dto/view-history.dto';

@Injectable()
export class ViewHistoryService {
    private readonly logger = new Logger(ViewHistoryService.name);

    constructor(
        @InjectRepository(ViewHistory)
        private readonly viewHistoryRepository: Repository<ViewHistory>,
    ) { }

    async findBySessionId(sessionId: string, limit: number = 50): Promise<ViewHistory[]> {
        return this.viewHistoryRepository.find({
            where: { sessionId },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    async findByUserId(userId: string, limit: number = 50): Promise<ViewHistory[]> {
        return this.viewHistoryRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    async create(dto: CreateViewHistoryDto): Promise<ViewHistory> {
        const viewHistory = this.viewHistoryRepository.create(dto);
        return this.viewHistoryRepository.save(viewHistory);
    }

    async getRecentlyViewedProducts(
        sessionId: string,
        limit: number = 10,
    ): Promise<ViewHistory[]> {
        return this.viewHistoryRepository.find({
            where: { sessionId, pageType: 'product' },
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    async clearSessionHistory(sessionId: string): Promise<void> {
        await this.viewHistoryRepository.delete({ sessionId });
    }

    async clearUserHistory(userId: string): Promise<void> {
        await this.viewHistoryRepository.delete({ userId });
    }

    async mergeSessionToUser(sessionId: string, userId: string): Promise<void> {
        await this.viewHistoryRepository.update(
            { sessionId },
            { userId },
        );
    }
}

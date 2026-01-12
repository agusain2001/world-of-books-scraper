import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../entities/review.entity';
import { CreateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
    private readonly logger = new Logger(ReviewService.name);

    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
    ) { }

    async findByProductId(productId: string): Promise<Review[]> {
        return this.reviewRepository.find({
            where: { productId },
            order: { createdAt: 'DESC' },
        });
    }

    async create(dto: CreateReviewDto): Promise<Review> {
        const review = this.reviewRepository.create(dto);
        return this.reviewRepository.save(review);
    }

    async createMany(reviews: CreateReviewDto[]): Promise<Review[]> {
        const entities = reviews.map(dto => this.reviewRepository.create(dto));
        return this.reviewRepository.save(entities);
    }

    async upsertForProduct(productId: string, reviews: Omit<CreateReviewDto, 'productId'>[]): Promise<Review[]> {
        // Delete existing reviews for the product
        await this.reviewRepository.delete({ productId });

        // Create new reviews
        const newReviews = reviews.map(review =>
            this.reviewRepository.create({
                ...review,
                productId,
            }),
        );

        return this.reviewRepository.save(newReviews);
    }

    async getAverageRating(productId: string): Promise<{ average: number; count: number }> {
        const result = await this.reviewRepository
            .createQueryBuilder('review')
            .select('AVG(review.rating)', 'average')
            .addSelect('COUNT(*)', 'count')
            .where('review.productId = :productId', { productId })
            .andWhere('review.rating IS NOT NULL')
            .getRawOne();

        return {
            average: parseFloat(result.average) || 0,
            count: parseInt(result.count) || 0,
        };
    }

    async delete(id: string): Promise<void> {
        await this.reviewRepository.delete(id);
    }

    async deleteByProductId(productId: string): Promise<void> {
        await this.reviewRepository.delete({ productId });
    }
}

import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CreateReviewDto, ReviewResponseDto } from './dto/review.dto';

@ApiTags('Reviews')
@Controller('api/reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) { }

    @Get('product/:productId')
    @ApiOperation({ summary: 'Get reviews for a product' })
    @ApiParam({ name: 'productId', description: 'Product ID' })
    @ApiResponse({ status: 200, type: [ReviewResponseDto] })
    async findByProductId(@Param('productId') productId: string) {
        return this.reviewService.findByProductId(productId);
    }

    @Get('product/:productId/rating')
    @ApiOperation({ summary: 'Get average rating for a product' })
    @ApiParam({ name: 'productId', description: 'Product ID' })
    @ApiResponse({ status: 200, description: 'Average rating and count' })
    async getAverageRating(@Param('productId') productId: string) {
        return this.reviewService.getAverageRating(productId);
    }

    @Post()
    @ApiOperation({ summary: 'Create a review' })
    @ApiResponse({ status: 201, type: ReviewResponseDto })
    async create(@Body() dto: CreateReviewDto) {
        return this.reviewService.create(dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a review' })
    @ApiParam({ name: 'id', description: 'Review ID' })
    @ApiResponse({ status: 204, description: 'Review deleted' })
    async delete(@Param('id') id: string) {
        return this.reviewService.delete(id);
    }
}

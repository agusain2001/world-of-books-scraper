import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min, Max, IsUUID, IsBoolean, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
    @ApiProperty()
    @IsUUID()
    productId: string;

    @ApiPropertyOptional({ example: 'John Doe' })
    @IsOptional()
    @IsString()
    author?: string;

    @ApiPropertyOptional({ example: 5 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    rating?: number;

    @ApiPropertyOptional({ example: 'Great book!' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ example: 'I really enjoyed reading this book...' })
    @IsOptional()
    @IsString()
    text?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    reviewDate?: Date;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    verified?: boolean;
}

export class ReviewResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    productId: string;

    @ApiPropertyOptional()
    author?: string;

    @ApiPropertyOptional()
    rating?: number;

    @ApiPropertyOptional()
    title?: string;

    @ApiPropertyOptional()
    text?: string;

    @ApiPropertyOptional()
    reviewDate?: Date;

    @ApiProperty()
    verified: boolean;

    @ApiProperty()
    createdAt: Date;
}

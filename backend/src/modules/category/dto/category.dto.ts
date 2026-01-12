import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min, IsUUID } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({ example: 'Fiction' })
    @IsString()
    title: string;

    @ApiProperty({ example: 'fiction' })
    @IsString()
    slug: string;

    @ApiPropertyOptional({ example: 'https://www.worldofbooks.com/en-gb/category/fiction' })
    @IsOptional()
    @IsString()
    url?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    parentId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    navigationId?: string;

    @ApiPropertyOptional({ example: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    order?: number;
}

export class UpdateCategoryDto {
    @ApiPropertyOptional({ example: 'Fiction' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ example: 'fiction' })
    @IsOptional()
    @IsString()
    slug?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    url?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @Min(0)
    productCount?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    @Min(0)
    order?: number;
}

export class CategoryResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    slug: string;

    @ApiPropertyOptional()
    url?: string;

    @ApiPropertyOptional()
    imageUrl?: string;

    @ApiProperty()
    productCount: number;

    @ApiProperty()
    order: number;

    @ApiPropertyOptional()
    parentId?: string;

    @ApiPropertyOptional()
    navigationId?: string;

    @ApiPropertyOptional()
    lastScrapedAt?: Date;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiPropertyOptional({ type: () => [CategoryResponseDto] })
    children?: CategoryResponseDto[];
}

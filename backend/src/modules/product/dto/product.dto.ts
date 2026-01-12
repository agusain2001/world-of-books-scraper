import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsNumber,
    IsBoolean,
    IsUUID,
    Min,
    IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProductDto {
    @ApiProperty({ example: 'prod-12345' })
    @IsString()
    sourceId: string;

    @ApiProperty({ example: 'The Great Gatsby' })
    @IsString()
    title: string;

    @ApiPropertyOptional({ example: 'F. Scott Fitzgerald' })
    @IsOptional()
    @IsString()
    author?: string;

    @ApiPropertyOptional({ example: 5.99 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;

    @ApiPropertyOptional({ example: 12.99 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    originalPrice?: number;

    @ApiPropertyOptional({ example: 'GBP' })
    @IsOptional()
    @IsString()
    currency?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @ApiProperty({ example: 'https://www.worldofbooks.com/en-gb/product/12345' })
    @IsString()
    sourceUrl: string;

    @ApiPropertyOptional({ example: 'Good' })
    @IsOptional()
    @IsString()
    condition?: string;

    @ApiPropertyOptional({ example: 'Paperback' })
    @IsOptional()
    @IsString()
    format?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    inStock?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    categoryId?: string;
}

export class UpdateProductDto {
    @ApiPropertyOptional({ example: 'The Great Gatsby' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ example: 'F. Scott Fitzgerald' })
    @IsOptional()
    @IsString()
    author?: string;

    @ApiPropertyOptional({ example: 5.99 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;

    @ApiPropertyOptional({ example: 12.99 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    originalPrice?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    imageUrl?: string;

    @ApiPropertyOptional({ example: 'Good' })
    @IsOptional()
    @IsString()
    condition?: string;

    @ApiPropertyOptional({ example: 'Paperback' })
    @IsOptional()
    @IsString()
    format?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    inStock?: boolean;
}

export enum ProductSortBy {
    TITLE = 'title',
    PRICE = 'price',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
}

export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC',
}

export class ProductQueryDto {
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ example: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number = 20;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    categorySlug?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    categoryId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    minPrice?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    maxPrice?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    author?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    condition?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    format?: string;

    @ApiPropertyOptional({ enum: ProductSortBy })
    @IsOptional()
    @IsEnum(ProductSortBy)
    sortBy?: ProductSortBy = ProductSortBy.CREATED_AT;

    @ApiPropertyOptional({ enum: SortOrder })
    @IsOptional()
    @IsEnum(SortOrder)
    sortOrder?: SortOrder = SortOrder.DESC;
}

export class ProductResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    sourceId: string;

    @ApiProperty()
    title: string;

    @ApiPropertyOptional()
    author?: string;

    @ApiPropertyOptional()
    price?: number;

    @ApiPropertyOptional()
    originalPrice?: number;

    @ApiProperty()
    currency: string;

    @ApiPropertyOptional()
    imageUrl?: string;

    @ApiProperty()
    sourceUrl: string;

    @ApiPropertyOptional()
    condition?: string;

    @ApiPropertyOptional()
    format?: string;

    @ApiProperty()
    inStock: boolean;

    @ApiPropertyOptional()
    lastScrapedAt?: Date;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class PaginatedProductsDto {
    @ApiProperty({ type: [ProductResponseDto] })
    data: ProductResponseDto[];

    @ApiProperty()
    total: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    limit: number;

    @ApiProperty()
    totalPages: number;

    @ApiProperty()
    hasNextPage: boolean;

    @ApiProperty()
    hasPrevPage: boolean;
}

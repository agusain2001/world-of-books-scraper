import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateNavigationDto {
    @ApiProperty({ example: 'Books' })
    @IsString()
    title: string;

    @ApiProperty({ example: 'books' })
    @IsString()
    slug: string;

    @ApiPropertyOptional({ example: 'https://www.worldofbooks.com/en-gb/books' })
    @IsOptional()
    @IsString()
    url?: string;

    @ApiPropertyOptional({ example: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    order?: number;
}

export class UpdateNavigationDto {
    @ApiPropertyOptional({ example: 'Books' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ example: 'books' })
    @IsOptional()
    @IsString()
    slug?: string;

    @ApiPropertyOptional({ example: 'https://www.worldofbooks.com/en-gb/books' })
    @IsOptional()
    @IsString()
    url?: string;

    @ApiPropertyOptional({ example: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    order?: number;
}

export class NavigationResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    slug: string;

    @ApiPropertyOptional()
    url?: string;

    @ApiProperty()
    order: number;

    @ApiPropertyOptional()
    lastScrapedAt?: Date;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

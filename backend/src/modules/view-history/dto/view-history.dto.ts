import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateViewHistoryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    userId?: string;

    @ApiProperty()
    @IsString()
    sessionId: string;

    @ApiProperty({ example: '/products/12345' })
    @IsString()
    path: string;

    @ApiPropertyOptional({ example: 'product' })
    @IsOptional()
    @IsString()
    pageType?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    entityId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    metadata?: Record<string, any>;
}

export class ViewHistoryResponseDto {
    @ApiProperty()
    id: string;

    @ApiPropertyOptional()
    userId?: string;

    @ApiProperty()
    sessionId: string;

    @ApiProperty()
    path: string;

    @ApiPropertyOptional()
    pageType?: string;

    @ApiPropertyOptional()
    entityId?: string;

    @ApiPropertyOptional()
    metadata?: Record<string, any>;

    @ApiProperty()
    createdAt: Date;
}

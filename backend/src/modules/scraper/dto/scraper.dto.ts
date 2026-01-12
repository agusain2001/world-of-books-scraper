import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsUrl } from 'class-validator';
import { ScrapeJobStatus, ScrapeTargetType } from '../../../entities/scrape-job.entity';

export class CreateScrapeJobDto {
    @ApiProperty({ example: 'https://www.worldofbooks.com/en-gb/books' })
    @IsUrl()
    targetUrl: string;

    @ApiProperty({ enum: ScrapeTargetType })
    @IsEnum(ScrapeTargetType)
    targetType: ScrapeTargetType;

    @ApiPropertyOptional()
    @IsOptional()
    metadata?: Record<string, any>;
}

export class ScrapeJobResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    targetUrl: string;

    @ApiProperty({ enum: ScrapeTargetType })
    targetType: ScrapeTargetType;

    @ApiProperty({ enum: ScrapeJobStatus })
    status: ScrapeJobStatus;

    @ApiProperty()
    itemsScraped: number;

    @ApiProperty()
    retryCount: number;

    @ApiProperty()
    maxRetries: number;

    @ApiPropertyOptional()
    startedAt?: Date;

    @ApiPropertyOptional()
    finishedAt?: Date;

    @ApiPropertyOptional()
    errorLog?: string;

    @ApiPropertyOptional()
    metadata?: Record<string, any>;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class TriggerScrapeDto {
    @ApiPropertyOptional({ example: false })
    @IsOptional()
    forceRefresh?: boolean;
}

import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { NavigationService } from './navigation.service';
import { ScraperService } from '../scraper/scraper.service';
import {
    CreateNavigationDto,
    UpdateNavigationDto,
    NavigationResponseDto,
} from './dto/navigation.dto';
import { TriggerScrapeDto } from '../scraper/dto/scraper.dto';

@ApiTags('Navigations')
@Controller('api/navigations')
export class NavigationController {
    constructor(
        private readonly navigationService: NavigationService,
        private readonly scraperService: ScraperService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Get all navigation headings' })
    @ApiResponse({ status: 200, type: [NavigationResponseDto] })
    async findAll() {
        return this.navigationService.findAll();
    }

    @Get(':slug')
    @ApiOperation({ summary: 'Get navigation by slug' })
    @ApiParam({ name: 'slug', description: 'Navigation slug' })
    @ApiResponse({ status: 200, type: NavigationResponseDto })
    @ApiResponse({ status: 404, description: 'Navigation not found' })
    async findBySlug(@Param('slug') slug: string) {
        return this.navigationService.findBySlug(slug);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new navigation' })
    @ApiResponse({ status: 201, type: NavigationResponseDto })
    async create(@Body() dto: CreateNavigationDto) {
        return this.navigationService.create(dto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a navigation' })
    @ApiParam({ name: 'id', description: 'Navigation ID' })
    @ApiResponse({ status: 200, type: NavigationResponseDto })
    @ApiResponse({ status: 404, description: 'Navigation not found' })
    async update(@Param('id') id: string, @Body() dto: UpdateNavigationDto) {
        return this.navigationService.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a navigation' })
    @ApiParam({ name: 'id', description: 'Navigation ID' })
    @ApiResponse({ status: 204, description: 'Navigation deleted' })
    @ApiResponse({ status: 404, description: 'Navigation not found' })
    async delete(@Param('id') id: string) {
        return this.navigationService.delete(id);
    }

    @Post('scrape')
    @ApiOperation({ summary: 'Trigger navigation scrape' })
    @ApiResponse({ status: 200, description: 'Scrape started' })
    async scrape(@Body() dto: TriggerScrapeDto) {
        return this.scraperService.scrapeNavigations(dto.forceRefresh);
    }
}

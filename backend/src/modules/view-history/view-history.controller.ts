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
import { ViewHistoryService } from './view-history.service';
import { CreateViewHistoryDto, ViewHistoryResponseDto } from './dto/view-history.dto';

@ApiTags('View History')
@Controller('api/view-history')
export class ViewHistoryController {
    constructor(private readonly viewHistoryService: ViewHistoryService) { }

    @Get('session/:sessionId')
    @ApiOperation({ summary: 'Get view history by session ID' })
    @ApiParam({ name: 'sessionId', description: 'Session ID' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, type: [ViewHistoryResponseDto] })
    async findBySessionId(
        @Param('sessionId') sessionId: string,
        @Query('limit') limit?: number,
    ) {
        return this.viewHistoryService.findBySessionId(sessionId, limit);
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Get view history by user ID' })
    @ApiParam({ name: 'userId', description: 'User ID' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, type: [ViewHistoryResponseDto] })
    async findByUserId(
        @Param('userId') userId: string,
        @Query('limit') limit?: number,
    ) {
        return this.viewHistoryService.findByUserId(userId, limit);
    }

    @Get('session/:sessionId/products')
    @ApiOperation({ summary: 'Get recently viewed products' })
    @ApiParam({ name: 'sessionId', description: 'Session ID' })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, type: [ViewHistoryResponseDto] })
    async getRecentlyViewedProducts(
        @Param('sessionId') sessionId: string,
        @Query('limit') limit?: number,
    ) {
        return this.viewHistoryService.getRecentlyViewedProducts(sessionId, limit);
    }

    @Post()
    @ApiOperation({ summary: 'Record a view' })
    @ApiResponse({ status: 201, type: ViewHistoryResponseDto })
    async create(@Body() dto: CreateViewHistoryDto) {
        return this.viewHistoryService.create(dto);
    }

    @Delete('session/:sessionId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Clear session history' })
    @ApiParam({ name: 'sessionId', description: 'Session ID' })
    @ApiResponse({ status: 204, description: 'History cleared' })
    async clearSessionHistory(@Param('sessionId') sessionId: string) {
        return this.viewHistoryService.clearSessionHistory(sessionId);
    }

    @Post('merge')
    @ApiOperation({ summary: 'Merge session history to user' })
    @ApiResponse({ status: 200, description: 'History merged' })
    async mergeSessionToUser(
        @Body() body: { sessionId: string; userId: string },
    ) {
        return this.viewHistoryService.mergeSessionToUser(body.sessionId, body.userId);
    }
}

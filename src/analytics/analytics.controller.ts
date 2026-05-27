import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { UrlsService } from '../urls/urls.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';

@ApiTags('Analytics')
@Controller('urls')

export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly urlsService: UrlsService,

  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get click stats for a short URL' })
  @ApiParam({ name: 'code', description: 'The short code to get stats for' })
  @ApiResponse({ status: 200, description: 'Returns total clicks and recent clicks' })
  @ApiResponse({ status: 403, description: 'You do not own this short URL' })
  @ApiResponse({ status: 404, description: 'Short URL not found' })
  @UseGuards(JwtAuthGuard)
  @Get(':code/stats')
  async getStats(@Param('code') code: string, @Req() req: Request) {
    const userId = (req.user as { id: string }).id;

    const shortUrl = await this.urlsService.findByCode(code);

    if (shortUrl.userId !== userId) {
      const { ForbiddenException } = await import('@nestjs/common');
      throw new ForbiddenException('You do not own this short URL');
    }

    return this.analyticsService.getStats(shortUrl.id);
  }
}
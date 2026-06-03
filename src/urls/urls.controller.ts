import { Controller, Post, Get, Delete, Body, Param, Redirect, UseGuards, Req, } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UrlsService } from './urls.service';
import { AnalyticsService } from 'src/analytics/analytics.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';

@ApiTags('URLs')
@Controller()
export class UrlsController {
  constructor(
    private readonly urlsService: UrlsService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  @ApiBearerAuth()

  @ApiOperation({ summary: 'Create a new short URL' })
  @ApiResponse({ status: 201, description: 'Short URL created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  
  @UseGuards(JwtAuthGuard, ThrottlerGuard)
  @Post('urls')
  create(@Body() dto: CreateUrlDto, @Req() req: Request) {
    const userId = (req.user as { id: string }).id;
    return this.urlsService.create(dto, userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all URLs for the logged-in user' })
  @ApiResponse({ status: 200, description: 'Returns array of short URLs' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })

  @UseGuards(JwtAuthGuard)
  @Get('urls')
  findAll(@Req() req: Request) {
    const userId = (req.user as { id: string }).id;
    return this.urlsService.findAllByUser(userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a short URL' })
  @ApiParam({ name: 'code', description: 'The short code to delete' })  

  @ApiResponse({ status: 200, description: 'Deleted successfully' })
  @ApiResponse({ status: 403, description: 'You do not own this short URL' })
  @ApiResponse({ status: 404, description: 'Short URL not found' })

  @UseGuards(JwtAuthGuard)
  @Delete('urls/:code')
  remove(@Param('code') code: string, @Req() req: Request) {
    const userId = (req.user as { id: string }).id;
    return this.urlsService.remove(code, userId);
  }

  @ApiOperation({ summary: 'Redirect to original URL' })
  @ApiParam({ name: 'code', description: 'The short code to redirect' })
  @ApiResponse({ status: 302, description: 'Redirects to the original URL' })
  @ApiResponse({ status: 404, description: 'Short URL not found' })

  @Get(':code')
  @Redirect()
  async redirect(@Param('code') code: string, @Req() req:Request) {
    const shortUrl = await this.urlsService.findByCode(code);

    const ipAddress = req.ip;

    await this.analyticsService.recordClick(shortUrl, ipAddress);

    await this.urlsService.incrementClickCount(shortUrl);

    return { url: shortUrl.originalUrl, statusCode: 302 };
  }
}
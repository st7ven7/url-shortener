import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClickEvent } from './click-event.entity';
import { ShortUrl } from '../urls/short-url.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(ClickEvent)
    private readonly clickEventRepository: Repository<ClickEvent>,
  ) {}

  async recordClick(shortUrl: ShortUrl, ipAddress?: string): Promise<void> {

    const clickEvent = this.clickEventRepository.create({
      shortUrlId: shortUrl.id,
      ipAddress: ipAddress ?? null,
    });

    await this.clickEventRepository.save(clickEvent);
  }

  async getStats(shortUrlId: string) {
    const totalClicks = await this.clickEventRepository.count({
      where: { shortUrlId },
    });

    const recentClicks = await this.clickEventRepository.find({
      where: { shortUrlId },
      order: { clickedAt: 'DESC' },
      
      take: 5,
    });

    return {
      totalClicks,
      recentClicks,
    };
  }
}
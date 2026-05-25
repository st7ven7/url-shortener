import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShortUrl } from './short-url.entity';
import { CreateUrlDto } from './dto/create-url.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(ShortUrl)
    private readonly shortUrlRepository: Repository<ShortUrl>,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateUrlDto, userId: string): Promise<ShortUrl & { shortUrl: string }> {
    
    const shortCode = this.generateShortCode();

    const shortUrl = this.shortUrlRepository.create({
      shortCode,
      originalUrl: dto.originalUrl,
      userId,
    });
    
    const saved = await this.shortUrlRepository.save(shortUrl);
    const baseUrl = this.config.get<string>('BASE_URL');

    return {
      ...saved,
      shortUrl: `${baseUrl}/${saved.shortCode}`,
    }
  }

  async findByCode(shortCode: string): Promise<ShortUrl> {

    const shortUrl = await this.shortUrlRepository.findOne({
      where: { shortCode },
    });

    if (!shortUrl) {
      throw new NotFoundException('Short URL not found');
    }

    return shortUrl;
  }

  async findAllByUser(userId: string): Promise<ShortUrl[]> {

    return this.shortUrlRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },

    });
  }

  async remove(shortCode: string, userId: string): Promise<{ message: string }> {

    const shortUrl = await this.findByCode(shortCode);

    if (shortUrl.userId !== userId) {
      throw new ForbiddenException('You do not own this short URL');
    }

    await this.shortUrlRepository.remove(shortUrl);
    return { message: 'Short URL deleted successfully' };
  }

  async incrementClickCount(shortUrl: ShortUrl): Promise<void> {

    shortUrl.clickCount += 1;
    await this.shortUrlRepository.save(shortUrl);
  }

  private generateShortCode(): string {

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
 
    }
    return result;
  }
}
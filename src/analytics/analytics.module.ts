import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { ClickEvent } from './click-event.entity';
import { UrlsModule } from 'src/urls/urls.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClickEvent]),

    UrlsModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
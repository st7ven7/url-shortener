import { IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({ example: 'https://www.google.com', description: 'The original long URL to shorten', })
  @IsUrl({}, { message: 'Please provide a valid URL' })
  originalUrl!: string;
}
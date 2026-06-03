import { IsUrl, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlDto {
  
  @ApiProperty({ example: 'https://www.google.com', description: 'The original long URL to shorten', })
  @IsUrl(
    {
      protocols: ['http','https'],
      require_protocol: true,
    }, 
    { message: 'Please provide a valid URL including http:// or https://' }
  )
  @MaxLength(2048, {message: 'URL is too long'})
  originalUrl!: string;
}
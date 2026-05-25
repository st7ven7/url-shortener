import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'ayush@test.com', description: 'User email address' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'secret123', description: 'Password — min 6 characters' })
  @IsString()
  @MinLength(6)
  password!: string;
}
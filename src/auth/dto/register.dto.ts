import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'ayush@test.com', description: 'User email address' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string;

  @ApiProperty({ example: 'secret123', description: 'Password — min 6 characters' })
  @IsString()
  @MinLength(6,{ message: 'Password must be at least 6 characters' })
  @MaxLength(32, { message: 'Password cannot exceed 32 characters' })
  @Matches(/(?=.*[0-9])/,{
    message: 'Passwrd must conatinat least one number',
  })
  password!: string;
}
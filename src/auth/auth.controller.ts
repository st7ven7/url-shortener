import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RefreshTokenGuard } from './refresh-token.guard';
import type { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiOperation({ summary: 'Login and receive access and refresh tokens' })
  @ApiResponse({ status: 200, description: 'Returns access token and refresh token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a new access token using refresh token' })
  @ApiResponse({ status: 200, description: 'Returns new access token and refresh token' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refresh(@Req() req: Request) {
    const userId = (req.user as { id: string }).id;
    const refreshToken = (req.user as { refreshToken: string }).refreshToken;

    return this.authService.refresh(userId, refreshToken);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and invalidate refresh token' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: Request) {
    const userId = (req.user as { id: string }).id;

    return this.authService.logout(userId);
  }
}
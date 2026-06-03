import { Injectable, ConflictException, UnauthorizedException, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    
  ) {}

  private async generateTokens(userId: string, email: string){
    
    const payload = { sub: userId, email };
    
    const accessToken = this.jwtService.sign(payload,{
      secret: this.configService.get<string>('JWT_SECRET')!,
      expiresIn: this.configService.get<JwtSignOptions['expiresIn']>('JWT_EXPIRES_IN'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET')!,
      expiresIn: this.configService.get<JwtSignOptions['expiresIn']>('JWT_REFRESH_EXPIRES_IN'),
    });

    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto) {
    
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    const user = await this.usersService.create(dto.email, hashedPassword);

    
    return { message: 'Registration successful', userId: user.id };
  }

  async login(dto: LoginDto) {
    
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
      
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.usersService.saveRefreshToken(user.id, tokens.refreshToken);
    
    return tokens;
  }

  async refresh(userId: string, refreshToken: string){
    const user = await this.usersService.validateRefreshToken(userId, refreshToken);

    if(!user){
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const tokens = await this.generateTokens(userId, user.email);

    await this.usersService.saveRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string){
    await this.usersService.clearRefreshToken(userId);

    return { message: 'Logged out sucessfully' };
  }
  
}
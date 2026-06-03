import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}

    async findByEmail(email:string): Promise<User | null>{
        return this.userRepository.findOne({where: {email}});
    }

    async findById(id: string): Promise<User | null> {
        return this.userRepository.findOne({ where: {id} });
    }

    async create(email:string, hashedPassword: string): Promise<User>{
        const user = this.userRepository.create({email, password: hashedPassword});
        return this.userRepository.save(user);
    }

    async saveRefreshToken(userId: string, refreshToken: string): Promise<void>{
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userRepository.update(userId, {
            refreshToken: hashedRefreshToken,
        });
    }

    async clearRefreshToken(userId: string): Promise<void>{
        await this.userRepository.update(userId, {
            refreshToken: null,
        });
    }

    async validateRefreshToken(userId: string, refreshToken: string,): Promise<User | null>{
        const user = await this.findById(userId);
        if (!user || !user.refreshToken){
            return null;
        }

        const tokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);

        if(!tokenMatches){
            return null;
        }
        return user;
    }
}

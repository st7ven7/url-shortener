import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}

    async findByEmail(email:string): Promise<User | null>{
        return this.userRepository.findOne({where: {email}});
    }

    async create(email:string, hashedPassword: string): Promise<User>{
        const user = this.userRepository.create({email, password: hashedPassword});
        return this.userRepository.save(user);
    }
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, } from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity('short-urls')
export class ShortUrl{
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({unique: true})
    shortCode!: string;

    @Column()
    originalUrl!: string;

    @Column({default: 0})
    clickCount!: number;

    @ManyToOne(() => User, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id'})
    @Column()
    userId!: string;

    @CreateDateColumn()
    createdAt!: Date;
}
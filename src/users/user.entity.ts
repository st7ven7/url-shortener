import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,} from 'typeorm';

@Entity('users')
export class User{
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({unique: true})
    email!:string;

    @Column()
    password!: string;

    @Column({type: 'varchar', nullable: true, default: null})
    refreshToken!: string | null;

    @CreateDateColumn()
    createdAt!: Date;
}
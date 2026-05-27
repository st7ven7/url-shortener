import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, } from 'typeorm';
import { ShortUrl } from '../urls/short-url.entity';

@Entity('click_events')
export class ClickEvent {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => ShortUrl, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'short_url_id' })
  shortUrl!: ShortUrl;

  @Column()
  shortUrlId!: string;

  @Column({ nullable: true })
  ipAddress!: string | null;

  @CreateDateColumn()
  clickedAt!: Date;
}
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column()
  publicationDate: string; // ISO 8601 format

  @Column()
  lastUpdate: string; // ISO 8601 format

  @Column('simple-json')
  categories: string[]; // Array of category IDs
}

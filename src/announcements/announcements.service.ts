import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './announcement.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementsService implements OnModuleInit {
  private readonly defaultAnnouncements = [
    {
      title: 'City Hall Holiday Hours',
      content:
        'City Hall will be closed on December 25th and January 1st. Regular hours will resume on January 2nd.',
      publicationDate: '2024-12-15T09:00:00Z',
      lastUpdate: '2024-12-18T14:30:00Z',
      categories: ['1', '6'],
    },
    {
      title: 'Road Maintenance on Main Street',
      content:
        'Main Street will be closed for repairs from January 5th to January 10th. Please use alternative routes.',
      publicationDate: '2024-12-20T10:00:00Z',
      lastUpdate: '2024-12-20T10:00:00Z',
      categories: ['5'],
    },
    {
      title: 'Community Clean-up Day',
      content:
        'Join us for our annual community clean-up day on January 15th at Central Park. Volunteers welcome!',
      publicationDate: '2024-12-10T08:00:00Z',
      lastUpdate: '2024-12-22T16:45:00Z',
      categories: ['1', '8'],
    },
    {
      title: 'New Library Opening',
      content:
        'The new downtown library branch will open on February 1st. Grand opening celebration planned.',
      publicationDate: '2024-12-01T12:00:00Z',
      lastUpdate: '2024-12-15T09:15:00Z',
      categories: ['1', '3'],
    },
  ];

  constructor(
    @InjectRepository(Announcement)
    private announcementsRepository: Repository<Announcement>,
  ) {}

  async onModuleInit() {
    const count = await this.announcementsRepository.count();
    if (count === 0) {
      await this.announcementsRepository.save(this.defaultAnnouncements);
    }
  }

  async findAll(): Promise<Announcement[]> {
    return this.announcementsRepository.find();
  }

  async findOne(id: string): Promise<Announcement> {
    const announcement = await this.announcementsRepository.findOneBy({
      id: parseInt(id, 10),
    });
    if (!announcement) {
      throw new NotFoundException({
        error: {
          code: 'NOT_FOUND',
          message: 'Announcement not found',
        },
      });
    }
    return announcement;
  }

  async create(
    createAnnouncementDto: CreateAnnouncementDto,
  ): Promise<Announcement> {
    const now = new Date().toISOString();
    const announcement = this.announcementsRepository.create({
      title: createAnnouncementDto.title,
      content: createAnnouncementDto.content,
      publicationDate: createAnnouncementDto.publicationDate,
      lastUpdate: now,
      categories: createAnnouncementDto.categories,
    });
    return this.announcementsRepository.save(announcement);
  }

  async update(
    id: string,
    updateAnnouncementDto: UpdateAnnouncementDto,
  ): Promise<Announcement> {
    const announcement = await this.findOne(id);
    const now = new Date().toISOString();
    Object.assign(announcement, updateAnnouncementDto, { lastUpdate: now });
    return this.announcementsRepository.save(announcement);
  }

  async remove(id: string): Promise<void> {
    const announcement = await this.findOne(id);
    await this.announcementsRepository.remove(announcement);
  }
}

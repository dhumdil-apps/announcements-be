import {
  Injectable,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './announcement.entity';
import { AnnouncementsGateway } from './announcements.gateway';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementsService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AnnouncementsService.name);
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
    private announcementsGateway: AnnouncementsGateway,
  ) {}

  async onApplicationBootstrap() {
    try {
      const count = await this.announcementsRepository.count();
      if (count === 0) {
        await this.announcementsRepository.save(this.defaultAnnouncements);
        this.logger.log('Seeded default announcements');
      }
    } catch (error) {
      this.logger.error('Failed to seed announcements', error);
    }
  }

  async findAll(
    categories?: string[],
    search?: string,
  ): Promise<Announcement[]> {
    const query =
      this.announcementsRepository.createQueryBuilder('announcement');

    if (search) {
      const searchTerm = `%${search}%`;
      query.where(
        'LOWER(announcement.title) LIKE LOWER(:search) OR LOWER(announcement.content) LIKE LOWER(:search)',
        { search: searchTerm },
      );
    }

    const announcements = await query.getMany();

    if (categories && categories.length > 0) {
      return announcements.filter((announcement) =>
        categories.some((cat) => announcement.categories.includes(cat)),
      );
    }

    return announcements;
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
    const saved = await this.announcementsRepository.save(announcement);
    this.announcementsGateway.notifyAnnouncementCreated(saved);
    return saved;
  }

  async update(
    id: string,
    updateAnnouncementDto: UpdateAnnouncementDto,
  ): Promise<Announcement> {
    const announcement = await this.findOne(id);
    const now = new Date().toISOString();
    Object.assign(announcement, updateAnnouncementDto, { lastUpdate: now });
    const saved = await this.announcementsRepository.save(announcement);
    this.announcementsGateway.notifyAnnouncementUpdated(saved);
    return saved;
  }

  async remove(id: string): Promise<void> {
    const announcement = await this.findOne(id);
    await this.announcementsRepository.remove(announcement);
  }
}

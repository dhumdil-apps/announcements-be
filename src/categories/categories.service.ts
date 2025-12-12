import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService implements OnApplicationBootstrap {
  private readonly logger = new Logger(CategoriesService.name);
  private readonly defaultCategories = [
    { label: 'Community events' },
    { label: 'Crime & Safety' },
    { label: 'Culture' },
    { label: 'Discounts & Benefits' },
    { label: 'Emergencies' },
    { label: 'For Seniors' },
    { label: 'Health' },
    { label: 'Kids & Family' },
  ];

  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async onApplicationBootstrap() {
    try {
      const count = await this.categoriesRepository.count();
      if (count === 0) {
        await this.categoriesRepository.save(this.defaultCategories);
        this.logger.log('Seeded default categories');
      }
    } catch (error) {
      this.logger.error('Failed to seed categories', error);
    }
  }

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }
}

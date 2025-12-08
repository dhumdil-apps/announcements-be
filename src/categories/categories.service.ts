import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService implements OnModuleInit {
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

  async onModuleInit() {
    const count = await this.categoriesRepository.count();
    if (count === 0) {
      await this.categoriesRepository.save(this.defaultCategories);
    }
  }

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementsModule } from './announcements/announcements.module';
import { CategoriesModule } from './categories/categories.module';
import { Announcement } from './announcements/announcement.entity';
import { Category } from './categories/category.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/announcements.db',
      entities: [Announcement, Category],
      synchronize: true,
    }),
    AnnouncementsModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

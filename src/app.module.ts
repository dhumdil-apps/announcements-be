import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementsModule } from './announcements/announcements.module';
import { CategoriesModule } from './categories/categories.module';
import { Announcement } from './announcements/announcement.entity';
import { Category } from './categories/category.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get('DATABASE_PATH', 'data/announcements.db'),
        entities: [Announcement, Category],
        synchronize: configService.get('DATABASE_SYNC', 'true') === 'true',
      }),
    }),
    AnnouncementsModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

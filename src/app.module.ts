import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementsModule } from './announcements/announcements.module';
import { CategoriesModule } from './categories/categories.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('TypeORM');
        const dbPath = configService.get(
          'DATABASE_PATH',
          'data/announcements.db',
        );
        const syncValue = configService.get('DATABASE_SYNC');
        const synchronize = syncValue === 'false' ? false : true;

        logger.log(`Database path: ${dbPath}`);
        logger.log(`DATABASE_SYNC env value: ${syncValue}`);
        logger.log(`Synchronize: ${synchronize}`);

        return {
          type: 'sqlite',
          database: dbPath,
          autoLoadEntities: true,
          synchronize,
        };
      },
    }),
    AnnouncementsModule,
    CategoriesModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}

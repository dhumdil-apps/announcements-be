import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HealthController } from './health.controller';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // Register health endpoint outside of global prefix
  const healthController = app.get(HealthController);
  app.getHttpAdapter().get('/', (req, res) => {
    res.json(healthController.getHealth());
  });
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
  });
  await app.listen(process.env.PORT ?? 3000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();

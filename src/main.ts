import { NestFactory } from '@nestjs/core';

import { AppModule } from './modules/app.module';
import { PORT } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(PORT);
}
bootstrap();

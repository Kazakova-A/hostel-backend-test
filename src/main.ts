import { NestFactory } from '@nestjs/core';

import { AppModule } from 'src/modules/app.module';
import { PORT } from 'src/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(PORT);
}
bootstrap();

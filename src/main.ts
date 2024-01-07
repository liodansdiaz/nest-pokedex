import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   //con esto cambio mi ruta agregando el /api/v2/....
  app.setGlobalPrefix('api/v2'); 

  //agregando globalmente el ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,

      transform: true,
      transformOptions:{
        enableImplicitConversion: true
      }
      }),
  );
  await app.listen(process.env.PORT);
}
bootstrap();

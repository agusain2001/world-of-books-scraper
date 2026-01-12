import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // CORS
  const frontendUrl = configService.get<string>('cors.frontendUrl');
  app.enableCors({
    origin: [frontendUrl, 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('World of Books Scraper API')
    .setDescription('API for scraping and serving book data from World of Books')
    .setVersion('1.0')
    .addTag('Navigations', 'Navigation headings management')
    .addTag('Categories', 'Book categories management')
    .addTag('Products', 'Book products management')
    .addTag('Reviews', 'Product reviews management')
    .addTag('Scrape Jobs', 'Web scraping job management')
    .addTag('View History', 'User browsing history tracking')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('port') || 3001;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();

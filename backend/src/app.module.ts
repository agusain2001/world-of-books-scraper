import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from './config/configuration';

// Entities
import {
  Navigation,
  Category,
  Product,
  ProductDetail,
  Review,
  ScrapeJob,
  ViewHistory,
} from './entities';

// Modules
import { NavigationModule } from './modules/navigation/navigation.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { ReviewModule } from './modules/review/review.module';
import { ScraperModule } from './modules/scraper/scraper.module';
import { ViewHistoryModule } from './modules/view-history/view-history.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = process.env.DATABASE_URL;

        // If DATABASE_URL is provided, use it (for cloud databases like Neon)
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [
              Navigation,
              Category,
              Product,
              ProductDetail,
              Review,
              ScrapeJob,
              ViewHistory,
            ],
            synchronize: configService.get<string>('nodeEnv') === 'development',
            logging: configService.get<string>('nodeEnv') === 'development',
            ssl: {
              rejectUnauthorized: false,
            },
          };
        }

        // Otherwise use individual config options
        return {
          type: 'postgres',
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.username'),
          password: configService.get<string>('database.password'),
          database: configService.get<string>('database.name'),
          entities: [
            Navigation,
            Category,
            Product,
            ProductDetail,
            Review,
            ScrapeJob,
            ViewHistory,
          ],
          synchronize: configService.get<string>('nodeEnv') === 'development',
          logging: configService.get<string>('nodeEnv') === 'development',
        };
      },
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Feature modules
    NavigationModule,
    CategoryModule,
    ProductModule,
    ReviewModule,
    ScraperModule,
    ViewHistoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

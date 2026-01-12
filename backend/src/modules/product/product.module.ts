import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../../entities/product.entity';
import { ProductDetail } from '../../entities/product-detail.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ScraperModule } from '../scraper/scraper.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, ProductDetail]),
        forwardRef(() => ScraperModule),
    ],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [ProductService],
})
export class ProductModule { }

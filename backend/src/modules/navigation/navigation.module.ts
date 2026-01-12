import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Navigation } from '../../entities/navigation.entity';
import { NavigationService } from './navigation.service';
import { NavigationController } from './navigation.controller';
import { ScraperModule } from '../scraper/scraper.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Navigation]),
        forwardRef(() => ScraperModule),
    ],
    controllers: [NavigationController],
    providers: [NavigationService],
    exports: [NavigationService],
})
export class NavigationModule { }

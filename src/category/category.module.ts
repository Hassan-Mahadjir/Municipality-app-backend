import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { CategoryTranslation } from 'src/entities/categoryTranslation.entity';
import { TranslationService } from 'src/translation/translation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, CategoryTranslation])],
  controllers: [CategoryController],
  providers: [CategoryService, TranslationService],
})
export class CategoryModule {}

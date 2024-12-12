import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';
import { CategoryTranslation } from 'src/entities/categoryTranslation.entity';
import { TranslationService } from 'src/translation/translation.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(CategoryTranslation)
    private translationRepo: Repository<CategoryTranslation>,
    private translationService: TranslationService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const newCategory = this.categoryRepo.create({
      name: createCategoryDto.name,
      language: createCategoryDto.language,
    });

    const savedCategory = await this.categoryRepo.save(newCategory);

    // Define target languages
    const allLanguages = ['EN', 'TR'];
    const sourceLang = createCategoryDto.language;
    const targetLanguages = allLanguages.filter((lang) => lang !== sourceLang);

    // Create translations for target languages
    for (const targetLang of targetLanguages) {
      const translatedName = createCategoryDto.name
        ? await this.translationService.translateText(
            createCategoryDto.name,
            targetLang,
          )
        : null;

      const translatedTranslation = this.translationRepo.create({
        name: translatedName,
        language: targetLang,
        category: savedCategory,
      });

      await this.translationRepo.save(translatedTranslation);
    }

    return {
      message: `category has been created successfully.`,
      data: savedCategory,
    };
  }

  async findAll() {
    const categories = await this.categoryRepo.find({
      relations: ['translations'],
    });

    return {
      message: `Successfully fetched ${categories.length} categories`,
      data: categories,
    };
  }

  async findOne(id: number) {
    const category = await this.categoryRepo.findOne({
      where: { id: id },
      relations: ['translations'],
    });

    if (!category)
      throw new NotFoundException(
        `The category with #ID: ${id} does not exist.`,
      );

    return {
      message: 'category has been fetched successfully',
      data: category,
    };
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepo.findOne({
      where: { id: id },
      relations: ['translations'],
    });

    if (!category)
      throw new NotFoundException(
        `The category with #ID: ${id} does not exist.`,
      );

    Object.assign(category, updateCategoryDto);

    if (updateCategoryDto.name) {
      const allLanguages = ['EN', 'TR'];
      const sourceLang = updateCategoryDto.language || category.language;
      const targetLanguages = allLanguages.filter(
        (lang) => lang !== sourceLang,
      );

      for (const targetLang of targetLanguages) {
        let existingTranslation = category.translations.find(
          (translation) => translation.language === targetLang,
        );

        // Translate fields if provided in the update DTO
        const translatedName = updateCategoryDto.name
          ? await this.translationService.translateText(
              updateCategoryDto.name,
              targetLang,
            )
          : existingTranslation?.name;

        if (existingTranslation) {
          Object.assign(existingTranslation, {
            name: translatedName,
          });
        } else {
          existingTranslation = this.translationRepo.create({
            name: translatedName || 'Translation unavailable',
            language: targetLang,
            category: category,
          });
          category.translations.push(existingTranslation);
        }

        await this.translationRepo.save(existingTranslation);
      }
    }

    const updatedCategory = await this.categoryRepo.save(category);

    return { message: `The category with #ID: ${id} has been updated.` };
  }

  async remove(id: number) {
    const category = await this.categoryRepo.findOne({
      where: { id: id },
      relations: ['translations'],
    });

    if (!category)
      throw new NotFoundException(
        `The category with #ID: ${id} does not exist.`,
      );

    // Remove associated translations
    if (category.translations?.length > 0) {
      for (const translation of category.translations) {
        await this.translationRepo.remove(translation);
      }
    }

    await this.categoryRepo.save(category);
    await this.categoryRepo.remove(category);

    return {
      message: `The category with ID #${id} has been successfully removed.`,
    };
  }
}

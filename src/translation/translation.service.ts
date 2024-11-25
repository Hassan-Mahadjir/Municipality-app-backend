import { Injectable } from '@nestjs/common';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import axios from 'axios';

@Injectable()
export class TranslationService {
  private readonly apiUrl = 'https://api-free.deepl.com/v2/translate'; // Use 'api.deepl.com' for paid plans
  private readonly apiKey = process.env.DEEPL_API_KEY;

  async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      const response = await axios.post(
        this.apiUrl,
        new URLSearchParams({
          auth_key: this.apiKey,
          text: text,
          target_lang: targetLanguage.toUpperCase(), // e.g., 'EN', 'FR'
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );

      const translations = response.data.translations;
      return translations[0]?.text || '';
    } catch (error) {
      console.error(
        'Error translating text:',
        error.response?.data || error.message,
      );
      throw new Error('Translation failed');
    }
  }

  create(createTranslationDto: CreateTranslationDto) {
    return 'This action adds a new translation';
  }

  findAll() {
    return `This action returns all translation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} translation`;
  }

  update(id: number, updateTranslationDto: UpdateTranslationDto) {
    return `This action updates a #${id} translation`;
  }

  remove(id: number) {
    return `This action removes a #${id} translation`;
  }
}

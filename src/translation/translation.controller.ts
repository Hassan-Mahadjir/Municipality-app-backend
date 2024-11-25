import { Controller } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';

@Controller('translation')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}
}

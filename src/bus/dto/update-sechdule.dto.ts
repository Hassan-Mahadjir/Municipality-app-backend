import { PartialType } from '@nestjs/mapped-types';
import { CreateSechduleDto } from './create-sechdule.dto';

export class UpdateSechduleDto extends PartialType(CreateSechduleDto) {
  returnTimes: string[];
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateWasteSechduleDto } from './create-waste-sechdule.dto';

export class UpdateWasteSechduleDto extends PartialType(
  CreateWasteSechduleDto,
) {}

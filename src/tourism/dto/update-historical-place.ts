import { PartialType } from '@nestjs/mapped-types';
import { CreateHistoricalPlaceDto } from './create-historical-place';

export class UpdateHistoricalPlaceDto extends PartialType(
  CreateHistoricalPlaceDto,
) {}

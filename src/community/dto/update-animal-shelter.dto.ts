import { PartialType } from '@nestjs/mapped-types';
import { CreateAnimalShelterDto } from './create-animal-shelter.dto';
export class UpdateAnimalShelterDto extends PartialType(
  CreateAnimalShelterDto,
) {}

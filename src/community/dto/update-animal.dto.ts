import { PartialType } from '@nestjs/mapped-types';
import { CreateAnimalDto } from './create-animal.dto';
import { IsNumber } from 'class-validator';
export class UpdateAnimalDto extends PartialType(CreateAnimalDto) {
  @IsNumber()
  userId: number;
}

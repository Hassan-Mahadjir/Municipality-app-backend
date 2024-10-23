import { PartialType } from '@nestjs/mapped-types';
import { CreateLineDto } from './create-line.dto';

export class UpdateBusDto extends PartialType(CreateLineDto) {}

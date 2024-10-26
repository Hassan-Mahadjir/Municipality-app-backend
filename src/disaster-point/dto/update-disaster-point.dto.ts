import { PartialType } from '@nestjs/mapped-types';
import { CreateDisasterPointDto } from './create-disaster-point.dto';

export class UpdateDisasterPointDto extends PartialType(CreateDisasterPointDto) {}

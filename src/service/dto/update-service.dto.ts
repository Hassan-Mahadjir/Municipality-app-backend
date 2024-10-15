import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './create-service.dto';
import { IsString } from 'class-validator';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}

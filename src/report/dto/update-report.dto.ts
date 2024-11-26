import { PartialType } from '@nestjs/mapped-types';
import { CreateReportDto } from './create-report.dto';
import { IsString } from 'class-validator';

export class UpdateReportDto extends PartialType(CreateReportDto) {
  @IsString()
  status?: string;
}

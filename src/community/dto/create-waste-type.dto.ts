import { IsString } from 'class-validator';

export class CreateWasteTypeDto {
  @IsString()
  type: string;

  @IsString()
  departmentName: string;
}

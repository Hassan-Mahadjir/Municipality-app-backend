import { IsNumber, IsString } from 'class-validator';

export class CreateEmergencyContactDto {
  @IsString()
  name: string;

  @IsNumber()
  phone: number;

  @IsString()
  departmentName: string;
}

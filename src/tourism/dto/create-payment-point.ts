import { IsArray, IsBoolean, IsString } from 'class-validator';

export class CreatePaymentPointDto {
  @IsString()
  branch: string;

  @IsString()
  office: string;

  @IsString()
  phone: string;
  @IsString()
  departmentName: string;

}

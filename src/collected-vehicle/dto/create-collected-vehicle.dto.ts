import { IsBoolean, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateCollectedVehicleDto {
  @IsString()
  plateNumber: string;

  @IsNumber()
  year: number;

  @IsString()
  brand: string;

  @IsString()
  reason: string;

  @IsString()
  location: string;

  @IsNumber()
  fee: number;

  @IsUrl()
  imageUrl: string;

  @IsString()
  language: string;

  @IsString()
  departmnetName: string;
}

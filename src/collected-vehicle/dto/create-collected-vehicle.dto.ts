import { IsBoolean, IsNumber, IsString } from 'class-validator';

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

  @IsBoolean()
  status: boolean;

  @IsString()
  departmnetName: string;
}

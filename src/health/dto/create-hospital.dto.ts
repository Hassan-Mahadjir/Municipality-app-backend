import { IsBoolean, IsString, IsUrl } from 'class-validator';

export class CreateHospitalDto {
  @IsString()
  name: string;
  @IsString()
  location: string;
  @IsUrl()
  imageUrl: string;
  @IsUrl()
  logo: string;
  @IsString()
  departmetName?: string;
}

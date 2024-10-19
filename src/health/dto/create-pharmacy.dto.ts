import { IsBoolean, IsString, IsUrl } from 'class-validator';

export class CreatePharmacyDto {
  @IsString()
  name: string;
  @IsString()
  location: string;
  @IsUrl()
  imageUrl: string;
  @IsUrl()
  logo: string;
  @IsBoolean()
  openthisWeek: boolean;
  @IsString()
  departmetName: string;
}

import { IsString, IsUrl } from 'class-validator';

export class CreateAnimalShelterDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsUrl()
  logo: string;

  @IsString()
  departmentName: string;
}

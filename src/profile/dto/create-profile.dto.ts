import { IsDate, IsString, IsUrl } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName?: string;
  @IsString()
  phone?: string;
  @IsUrl()
  avatar?: string;
  @IsString()
  gender?: string;
  @IsDate()
  dateofBirth?: Date;
  @IsString()
  description?: string;
  @IsString()
  address?: string;
  @IsString()
  language: string;
}

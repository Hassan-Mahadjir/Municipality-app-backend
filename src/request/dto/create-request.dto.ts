import { IsString } from 'class-validator';

export class CreateRequestDto {
  @IsString()
  subject: string;

  @IsString()
  location: string;
}

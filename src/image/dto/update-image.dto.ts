import { IsString, IsOptional } from 'class-validator';

export class UpdateImageDto {
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  subServiceId?: string; // or you can use a number if that's what you're working with
}

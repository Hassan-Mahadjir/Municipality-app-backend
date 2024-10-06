import { IsString, IsNotEmpty } from 'class-validator';

export class CreateImageDto {
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  subServiceId: string; // or you can use a number if that's what you're working with
}

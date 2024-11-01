import { IsUrl } from 'class-validator';

export class CreateImageDto {
  @IsUrl()
  imageUrl: string;
}

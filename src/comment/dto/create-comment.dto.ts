import { IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  body: string;

  @IsNumber()
  recommenation: number;

  @IsString()
  commentedOn: string;

  historicalPlaceId?: number;

  restaurantId?: number;
}

import { IsNotEmpty, IsInt, IsString, IsDate } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  body: string;

  @IsInt()
  recommendation: number;

  @IsDate()
  createAt: Date;
}

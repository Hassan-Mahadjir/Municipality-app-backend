import { IsInt, IsPositive } from 'class-validator';

export class IdParamDto {
  @IsPositive()
  @IsInt()
  userId: number;
}

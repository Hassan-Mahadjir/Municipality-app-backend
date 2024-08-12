import { IsDate, IsString, Length } from 'class-validator';

export class CreateStaffDto {
  @IsString()
  email: string;

  @IsString()
  @Length(6, 20)
  password: string;

  @IsDate()
  createAt: Date;
}

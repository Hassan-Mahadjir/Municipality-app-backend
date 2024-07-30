import { IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  userName: string;

  @IsString()
  @Length(6, 30)
  password: string;

  @IsString()
  email: string;
}

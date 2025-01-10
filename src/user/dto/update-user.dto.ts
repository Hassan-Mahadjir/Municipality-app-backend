import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString } from 'class-validator';
import { Role } from 'src/auth/enums/role.enums';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // @IsString()
  resetCodeExpiry?: Date;

  // @IsString()
  resetCode?: string;

  role?: Role;
}

import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
export class ForgetPasswordDto extends PartialType(CreateUserDto) {}

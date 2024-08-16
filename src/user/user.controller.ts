import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  SetMetadata,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDTO } from 'src/user/dto/pagination.dto';
import { ParseIdPipe } from 'src/user/pipes/paraseIdPipe';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Role } from 'src/auth/enums/role.enums';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';

@Roles(Role.USER)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return this.userService.findOne(req.user.id);
  }

  @Patch(':id')
  update(@Param('id', ParseIdPipe) id, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  // @SetMetadata("role",[Role.ADMIN])
  @Roles(Role.STAFF)
  // @UseGuards(RolesGuard)
  // @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id) {
    return this.userService.remove(id);
  }
}

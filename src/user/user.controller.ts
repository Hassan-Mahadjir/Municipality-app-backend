import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { IdParamDto } from './dto/idParam.dto';
import { ParseIdPipe } from './pipes/paraseIdPipe';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  findAllUsers() {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  findUser(@Param('id', ParseIntPipe) userId) {
    return this.userService.findUser(userId);
  }

  @Post()
  @UsePipes()
  createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @Patch(':userId')
  updateUser(
    @Param('userId', ParseIdPipe) userId,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.updateUser(userId, body);
  }

  @Delete(':userId')
  deleteUser(@Param('userId', ParseIdPipe) userId) {
    return this.userService.deleteUser(userId);
  }
}

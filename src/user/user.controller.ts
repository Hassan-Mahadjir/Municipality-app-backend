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

@Controller('user')
export class UserController {
  @Get()
  findAllUsers() {
    return 'All Users';
  }

  @Get(':id')
  findUser(@Param('id', ParseIntPipe) id) {
    console.log(id);
    return id;
  }

  @Post()
  @UsePipes()
  createUser(@Body() body: CreateUserDto) {
    return body;
  }

  @Patch(':userId')
  updateUser(@Param() param: IdParamDto, @Body() body: CreateUserDto) {
    return 'user is updated';
  }

  @Delete()
  deleteUser() {
    return 'user is deleted';
  }
}

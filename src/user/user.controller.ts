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
  NotFoundException,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDTO } from 'src/department/dto/pagination.dto';
import { ParseIdPipe } from 'src/user/pipes/paraseIdPipe';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Role } from 'src/auth/enums/role.enums';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { ProfileService } from 'src/profile/profile.service';
import { UpdateProfileDto } from 'src/profile/dto/update-profile.dto';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';
import { Public } from 'src/auth/decorators/public.decorators';

// @Roles(Role.USER, Role.ADMIN)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private profileService: ProfileService,
  ) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const { password, email, ...profileField } = createUserDto;

    const profileData: CreateProfileDto = profileField as CreateProfileDto;

    console.log(profileData);

    return this.userService.create(createUserDto, profileData);
    // return 'user has been created';
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    const profile = this.profileService.findOne(req.user.id);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIdPipe) id, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('manage/:id')
  updaterole(
    @Param('id', ParseIdPipe) id,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id) {
    return this.userService.remove(id);
  }

  @Patch('profile/:id')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    const userId = Number(req.user.id);

    if (isNaN(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    return this.profileService.update(userId, updateProfileDto);
  }

  @Patch('manage-profile/:id')
  async updateProfileAdmin(
    @Body() updateProfileDto: UpdateProfileDto,
    @Param('id', ParseIdPipe) id,
  ) {
    if (isNaN(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    return this.profileService.update(id, updateProfileDto);
  }

  @Post('profile')
  createProfile(@Req() req, @Body() createProfileDto: CreateProfileDto) {
    const userId = req.user.id;
    return this.profileService.create(userId, createProfileDto);
  }

  @Get('/staff')
  getResposibles() {
    return this.userService.getResposibles();
  }

  @Get('/users')
  getUsers() {
    return this.userService.getUsers();
  }

  @Get(':id')
  getUser(@Param('id', ParseIdPipe) id) {
    return this.userService.getUser(id);
  }
}

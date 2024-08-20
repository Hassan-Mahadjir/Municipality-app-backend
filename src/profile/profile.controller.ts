import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { ParseIdPipe } from 'src/user/pipes/paraseIdPipe';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post(':id')
  create(
    @Body() createProfileDto: CreateProfileDto,
    @Param('id', ParseIdPipe) id,
  ) {
    return this.profileService.create(id, createProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIdPipe) id) {
    return this.profileService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIdPipe) id,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.update(id, updateProfileDto);
  }
}

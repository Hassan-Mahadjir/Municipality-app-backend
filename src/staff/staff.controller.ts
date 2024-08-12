import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { ParseIdPipe } from 'src/user/pipes/paraseIdPipe';
import { CreateStaffDto } from './dto/createStaff.dto';
import { UpdateStaffDto } from './dto/updateStaff.dto';

@Controller('staff')
export class StaffController {
  constructor(private staffSrevice: StaffService) {}
  @Get()
  findAllStaff() {}

  @Get(':id')
  findStaff(@Param('id', ParseIdPipe) staffId) {
    return staffId;
  }

  @Post()
  createStaff(@Body() body: CreateStaffDto) {
    return;
  }

  @Patch(':id')
  updateStaff(@Param('id', ParseIdPipe) staffId, @Body() body: UpdateStaffDto) {
    return;
  }

  @Delete(':id')
  deleteStaff(@Param('id', ParseIdPipe) staffId) {
    return;
  }
}

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
import { ParseIdPipe } from 'src/staff/pipes/paraseIdPipe';
import { CreateStaffDto } from './dto/createStaff.dto';
import { UpdateStaffDto } from './dto/updateStaff.dto';

@Controller('staff')
export class StaffController {
  constructor(private staffSrevice: StaffService) {}
  @Get()
  findAllStaff() {
    return this.staffSrevice.findAllStaff();
  }

  @Get(':id')
  findStaff(@Param('id', ParseIdPipe) staffId) {
    return this.staffSrevice.findStaff(staffId);
  }

  @Post()
  createStaff(@Body() body: CreateStaffDto) {
    return this.staffSrevice.createStaff(body);
  }

  @Patch(':id')
  updateStaff(@Param('id', ParseIdPipe) staffId, @Body() body: UpdateStaffDto) {
    return this.staffSrevice.updateStaff(staffId, body);
  }

  @Delete(':id')
  deleteStaff(@Param('id', ParseIdPipe) staffId) {
    return this.staffSrevice.deleteStaff(staffId);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { ParseIdPipe } from 'src/user/pipes/paraseIdPipe';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enums';
import { PaginationDTO } from './dto/pagination.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@UseGuards(JwtAuthGuard)
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Roles(Role.ADMIN)
  @Post(':id')
  async create(
    @Param('id', ParseIdPipe) id,
    @Body() createDepartmentDto: CreateDepartmentDto,
  ) {
    return await this.departmentService.create(id, createDepartmentDto);
  }

  @Get()
  findAll(@Query() paginationDTO: PaginationDTO) {
    return this.departmentService.findAll(paginationDTO);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIdPipe) id) {
    return await this.departmentService.findDepartment(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIdPipe) id,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return await this.departmentService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIdPipe) id) {
    return this.departmentService.remove(id);
  }
}

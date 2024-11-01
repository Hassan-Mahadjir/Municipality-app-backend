import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ParseIdPipe } from 'src/user/pipes/paraseIdPipe';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('/:id')
  create(
    @Body() createReportDto: CreateReportDto,
    @Param('id', ParseIdPipe) id,
  ) {
    return this.reportService.create(createReportDto, id);
  }

  @Get()
  findAll() {
    return this.reportService.findAll();
  }

  @Get('/user-reports/:id')
  findUseReport(@Param('id', ParseIdPipe) id) {
    return this.reportService.findUserReports(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportService.update(+id, updateReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportService.remove(+id);
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from 'src/entities/report.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { DepartmentService } from 'src/department/department.service';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report) private reportRepo: Repository<Report>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private userService: UserService,
    private departmentService: DepartmentService,
  ) {}

  async create(createReportDto: CreateReportDto, userId: number) {
    const user = await this.userService.findOne(userId);
    const department = await this.departmentService.findDepartmentbyName(
      createReportDto.departmentName,
    );

    if (!user)
      throw new NotFoundException(
        `The user with #ID: ${userId} does not exist.`,
      );

    if (!department)
      throw new NotFoundException(
        `The department ${createReportDto.departmentName} does not exist.`,
      );

    const newReport = this.reportRepo.create({
      subject: createReportDto.subject,
      location: createReportDto.location,
      message: createReportDto.message,
      department: department,
      user: user,
    });

    return await this.reportRepo.save(newReport);
  }

  async findAll() {
    const report = await this.reportRepo.find({
      relations: ['user', 'department'],
    });
    return report;
  }

  async findUserReports(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['reports'],
    });
    if (!user)
      throw new NotFoundException(`The user #ID: ${userId} does not exist.`);

    return user;
  }

  async findOne(id: number) {
    const reportInfo = await this.reportRepo.findOne({
      where: { id: id },
      relations: ['user', 'department', 'user.profile'],
    });

    if (!reportInfo)
      throw new NotFoundException(
        `The request with #ID: ${id} does not exist.`,
      );
    return reportInfo;
  }

  async update(id: number, updateReportDto: UpdateReportDto) {
    const updatedRequest = await this.reportRepo.update(
      { id: id },
      updateReportDto,
    );
    return { message: `The report with #ID: ${id} has been updated.` };
  }

  async remove(id: number) {
    // Find the report by ID and include its relations
    const report = await this.reportRepo.findOne({
      where: { id },
      relations: ['user', 'department'],
    });

    // If the report does not exist, throw an error
    if (!report) {
      throw new NotFoundException(`The request with ID #${id} does not exist.`);
    }

    // Remove associations if needed
    if (report.user) {
      report.user = null;
    }
    if (report.department) {
      report.department = null;
    }

    // Save changes to clear associations
    await this.reportRepo.save(report);

    // Now remove the report from the database
    await this.reportRepo.remove(report);

    return {
      message: `The report with ID #${id} has been successfully removed.`,
    };
  }
}

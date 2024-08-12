import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from 'src/entities/staff.entity';
import { Repository } from 'typeorm';
import { CreateStaffDto } from './dto/createStaff.dto';
import { UpdateStaffDto } from './dto/updateStaff.dto';

@Injectable()
export class StaffService {
  constructor(@InjectRepository(Staff) private staffRepo: Repository<Staff>) {}

  async findAllStaff() {
    return await this.staffRepo.find();
  }

  async findStaff(id: number) {
    const staff = await this.staffRepo.findOne({
      where: {
        id: id,
      },
    });

    if (!staff) throw new NotFoundException();
    return staff;
  }

  async createStaff(body: CreateStaffDto) {
    return await this.staffRepo.save(body);
  }

  async updateStaff(id: number, body: UpdateStaffDto) {
    return await this.staffRepo.update({ id }, body);
  }

  async deleteStaff(id: number) {
    return await this.staffRepo.delete({
      id: id,
    });
  }
}

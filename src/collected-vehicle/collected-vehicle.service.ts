import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCollectedVehicleDto } from './dto/create-collected-vehicle.dto';
import { UpdateCollectedVehicleDto } from './dto/update-collected-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CollectedVehicle } from 'src/entities/collected-vehicle.entity';
import { Repository } from 'typeorm';
import { DepartmentService } from 'src/department/department.service';

@Injectable()
export class CollectedVehicleService {
  constructor(
    @InjectRepository(CollectedVehicle)
    private collectedVehicleRepo: Repository<CollectedVehicle>,
    private departmentService: DepartmentService,
  ) {}

  async create(createCollectedVehicleDto: CreateCollectedVehicleDto) {
    const department = await this.departmentService.findDepartmentbyName(
      createCollectedVehicleDto.departmnetName,
    );

    if (!department)
      throw new NotFoundException(
        `The department with ${createCollectedVehicleDto.departmnetName} does not exists.`,
      );

    if (
      createCollectedVehicleDto.departmnetName.toLocaleLowerCase() != 'traffic'
    )
      throw new UnauthorizedException(
        'The service is not allowed to be assigned here',
      );

    const isFound = this.findVehicleByPlateNum(
      createCollectedVehicleDto.plateNumber,
    );

    const newCollectedVehicle = await this.collectedVehicleRepo.create({
      ...createCollectedVehicleDto,
      departmnet: department,
    });

    return this.collectedVehicleRepo.save(newCollectedVehicle);
  }

  findAll() {
    return this.collectedVehicleRepo.find();
  }

  async findOne(id: number) {
    return await this.collectedVehicleRepo.findOne({ where: { id: id } });
  }

  async findVehicleByPlateNum(plateNumber: string) {
    return await this.collectedVehicleRepo.findOne({
      where: { plateNumber: plateNumber },
    });
  }

  update(id: number, updateCollectedVehicleDto: UpdateCollectedVehicleDto) {
    return this.collectedVehicleRepo.update({ id }, updateCollectedVehicleDto);
  }

  remove(id: number) {
    return this.collectedVehicleRepo.delete(id);
  }
}

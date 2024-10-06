import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HealthService } from './health.service';
import { Public } from 'src/auth/decorators/public.decorators';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enums';
import { ParseIdPipe } from 'src/user/pipes/paraseIdPipe';
import { CreatePharmacyDto } from './dto/create-pharmacy.dto';
import {UpdatePharmacyDto} from 'src//health/dto/update-pharmacy.dto'
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import {CreateHospitalDto} from './dto/create-hospital.dto'

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Post("pharmacy")
  createPharmacy(@Body() CreatePharmacyDto: CreatePharmacyDto) {
    return this.healthService.createPharmacy(CreatePharmacyDto);
  }


  @Get('/pharmacy')
  findAllPharmacy() {
    return this.healthService.findAllPharmacy();
  }

  @Get('/pharmacy/:id')
  findOnePharmacy(@Param('id') id: string) {
    return this.healthService.findOnePharmacy(+id);
  }

  @Patch('/pharmacy/:id')
  updatePharmcay(@Param('id') id: string, @Body() UpdatePharmacyDto: UpdatePharmacyDto) {
    return this.healthService.updatePharmcay(+id, UpdatePharmacyDto);
  }
  @Roles(Role.ADMIN,Role.STAFF) //to specify that this functionality is only valid to staff,admin
  @Delete('/pharmacy/:id')
  removePharmacy(@Param('id',ParseIdPipe) id) {
    return this.healthService.removePharmacy(id);
  }


  @Post("hospital")
  createHospital(@Body() CreateHospitalDto: CreateHospitalDto) {
    return this.healthService.createHospital(CreateHospitalDto);
  }


  @Get('/hospital')
  findAllHospital() {
    return this.healthService.findAllHospital();
  }

  @Get('/hospital/:id')
  findOneHospital(@Param('id') id: string) {
    return this.healthService.findOneHospital(+id);
  }

  @Patch('/hospital/:id')
  updateHospital(@Param('id') id: string, @Body() UpdateHospitalDto: UpdateHospitalDto) {
    return this.healthService.updateHospital(+id, UpdateHospitalDto);
  }
  @Roles(Role.ADMIN,Role.STAFF) //to specify that this functionality is only valid to staff,admin
  @Delete('/hospital/:id')
  removeHospital(@Param('id',ParseIdPipe) id) {
    return this.healthService.removeHospital(id);
  }

  
}

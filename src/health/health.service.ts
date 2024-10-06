import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pharmacy } from 'src/entities/pharmacy.entity';
import { Repository } from 'typeorm';
import { Hospital } from 'src/entities/hospitals.entity';
import {CreatePharmacyDto} from 'src/health/dto/create-pharmacy.dto'
import { CreateHospitalDto } from './dto/create-hospital.dto';
import {UpdatePharmacyDto} from 'src/health/dto/update-pharmacy.dto'
import { UpdateHospitalDto } from './dto/update-hospital.dto';
@Injectable()
export class HealthService {
  constructor(@InjectRepository(Pharmacy) private pharmacyRepo: Repository<Pharmacy>,@InjectRepository(Hospital) private hospitalRepo: Repository<Hospital>){
  
  }
  createPharmacy(CreatePharmacyDto: CreatePharmacyDto) {
    return this.pharmacyRepo.save(CreatePharmacyDto);
  }

  findAllPharmacy() {
    return this.pharmacyRepo.find() ;
  }

  findOnePharmacy(id: number) {
    return this.pharmacyRepo.findOne({where:{
      id:id
    }});
  }

  updatePharmcay(id: number, UpdatePharmacyDto: UpdatePharmacyDto) {
    return this.pharmacyRepo.update({id},UpdatePharmacyDto);
  }

  removePharmacy(id: number) {
    return this.pharmacyRepo.delete(id);
  }


  createHospital(CreateHospitalDto: CreateHospitalDto) {
    return this.hospitalRepo.save(CreateHospitalDto);
  }

  findAllHospital() {
    return this.hospitalRepo.find() ;
  }

  findOneHospital(id: number) {
    return this.hospitalRepo.findOne({where:{
      id:id
    }});
  }

  updateHospital(id: number, UpdateHospitalDto: UpdateHospitalDto) {
    return this.hospitalRepo.update({id},UpdateHospitalDto);
  }

  removeHospital(id: number) {
    return this.hospitalRepo.delete(id);
  }
}

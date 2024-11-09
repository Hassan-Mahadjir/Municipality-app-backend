import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreateEmergencyContactDto } from './dto/create-emergency-contact.dto';
import { UpdateEmergencyContactDto } from './dto/update-emergency-contact.dto';
import { UpdateWasteSechduleDto } from './dto/update-waste-sechdule.dto';
import { CreateWasteTypeDto } from './dto/create-waste-type.dto';
import { UpdateWasteTypeDto } from './dto/update-waste-type.dto';
import { CreateWasteSechduleDto } from './dto/create-waste-sechdule.dto';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { CreateAnimalShelterDto } from './dto/create-animal-shelter.dto';
import { UpdateAnimalShelterDto } from './dto/update-animal-shelter.dto';
import { CreateDisasterPointDto } from './dto/create-disaster-point.dto';
import { UpdateDisasterPointDto } from './dto/update-disaster-point.dto';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Post('emergency-contact')
  create(@Body() createEmergencyContactDto: CreateEmergencyContactDto) {
    return this.communityService.createEmergencyContact(
      createEmergencyContactDto,
    );
  }

  @Get('emergency-contact')
  findAll() {
    return this.communityService.findAllEmergencyContacts();
  }

  @Get('emergency-contact/:id')
  findOne(@Param('id') id: string) {
    return this.communityService.findOneEmergencyContact(+id);
  }

  @Patch('emergency-contact/:id')
  update(
    @Param('id') id: string,
    @Body() updateEmergencyContactDto: UpdateEmergencyContactDto,
  ) {
    return this.communityService.updateEmergencyContact(
      +id,
      updateEmergencyContactDto,
    );
  }

  @Delete('emergency-contact/:id')
  remove(@Param('id') id: string) {
    return this.communityService.removeEmergencyContact(+id);
  }

  @Post('waste-type')
  createWasteType(@Body() createWasteTypeDto: CreateWasteTypeDto) {
    return this.communityService.createWasteType(createWasteTypeDto);
  }

  @Patch('waste-type/:id')
  updateWasteType(
    @Body() updateWasteTypeDto: UpdateWasteTypeDto,
    @Param('id') id: string,
  ) {
    return this.communityService.modifyWasteType(+id, updateWasteTypeDto);
  }

  @Post('waste-sechdule')
  createWasteSechdule(@Body() createWasteSechduleDto: CreateWasteSechduleDto) {
    return this.communityService.createWasteSechdule(createWasteSechduleDto);
  }

  @Patch('waste-sechdule/:id')
  updateWasteSechdule(
    @Body() updateWasteSechdule: UpdateWasteSechduleDto,
    @Param('id') id: string,
  ) {
    return this.communityService.updateWasteSechdule(+id, updateWasteSechdule);
  }

  @Delete('waste-type/:id')
  deleteWaste(@Param('id') id: string) {
    return this.communityService.deleteWasteType(+id);
  }

  @Post('animal-report/:id')
  createAnimalReport(
    @Param('id') id: string,
    @Body() createAnimalReportDto: CreateAnimalDto,
  ) {
    return this.communityService.CreateAnimalReport(+id, createAnimalReportDto);
  }

  @Get('animal-report/:id')
  findAnimalReport(@Param('id') id: string) {
    return this.communityService.findAinmalReport(+id);
  }

  @Get('animal-report')
  findAllAnimalReport() {
    return this.communityService.findAllAnimalReport();
  }

  @Patch('animal-report/:id')
  updateAnimalReport(
    @Body() updateAnimalDto: UpdateAnimalDto,
    @Param('id') id: string,
  ) {
    return this.communityService.updateAnimalReport(+id, updateAnimalDto);
  }

  @Delete('animal-report/:id')
  deleteAnimalReport(@Param('id') id: string) {
    return this.communityService.deleteAnimalReport(+id);
  }

  @Post('animal-shelter')
  createAnimalShelter(@Body() createAnimalShelterDto: CreateAnimalShelterDto) {
    return this.communityService.createAnimalShelter(createAnimalShelterDto);
  }
  @Get('animal-shelter/:id')
  findAnimalShelter(@Param('id') id: string) {
    return this.communityService.findAnimalShelter(+id);
  }

  @Get('animal-shelter')
  findAllAnimalShelters() {
    return this.communityService.findAllAnimalShelters();
  }

  @Patch('animal-shelter/:id')
  updateAnimalShelter(
    @Param('id') id: string,
    @Body() updateAimalShelter: UpdateAnimalShelterDto,
  ) {
    return this.communityService.updateAnimalShelter(+id, updateAimalShelter);
  }

  @Delete('animal-shelter/:id')
  deleteAnimalShelter(@Param('id') id: string) {
    return this.communityService.deleteAnimalShelter(+id);
  }

  @Post('disaster-point')
  createDisasterPoint(@Body() createDisasterPointDto: CreateDisasterPointDto) {
    return this.communityService.createDisasterPoint(createDisasterPointDto);
  }

  @Get('disaster-point')
  findAllDisasterPoints() {
    return this.communityService.findAllDisasterPoints();
  }

  @Get('disaster-point/:id')
  findDisasterPoint(@Param('id') id: string) {
    return this.communityService.findDisasterPoint(+id);
  }

  @Patch('disaster-point/:id')
  updateDisasterPoint(
    @Param('id') id: string,
    @Body() updateDisasterPointDto: UpdateDisasterPointDto,
  ) {
    return this.communityService.updateDisasterPoint(
      +id,
      updateDisasterPointDto,
    );
  }

  @Delete('disaster-point/:id')
  removeDisasterPoint(@Param('id') id: string) {
    return this.communityService.removeDisasterPoint(+id);
  }
}

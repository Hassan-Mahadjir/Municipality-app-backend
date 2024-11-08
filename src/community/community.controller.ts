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
  deleteAnimalREport(@Param('id') id: string) {
    return this.communityService.deleteAnimalReport(+id);
  }
}

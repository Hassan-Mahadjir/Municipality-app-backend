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
}

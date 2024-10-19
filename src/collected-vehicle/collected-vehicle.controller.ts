import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CollectedVehicleService } from './collected-vehicle.service';
import { CreateCollectedVehicleDto } from './dto/create-collected-vehicle.dto';
import { UpdateCollectedVehicleDto } from './dto/update-collected-vehicle.dto';
import { ParseIdPipe } from 'src/user/pipes/paraseIdPipe';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enums';

@Controller('collected-vehicle')
export class CollectedVehicleController {
  constructor(
    private readonly collectedVehicleService: CollectedVehicleService,
  ) {}

  @Post()
  create(@Body() createCollectedVehicleDto: CreateCollectedVehicleDto) {
    return this.collectedVehicleService.create(createCollectedVehicleDto);
  }

  @Get()
  findAll() {
    return this.collectedVehicleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIdPipe) id) {
    return this.collectedVehicleService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.STAFF)
  @Patch(':id')
  update(
    @Param('id', ParseIdPipe) id,
    @Body() updateCollectedVehicleDto: UpdateCollectedVehicleDto,
  ) {
    return this.collectedVehicleService.update(+id, updateCollectedVehicleDto);
  }

  @Roles(Role.ADMIN, Role.STAFF)
  @Delete(':id')
  remove(@Param('id', ParseIdPipe) id) {
    return this.collectedVehicleService.remove(id);
  }
}

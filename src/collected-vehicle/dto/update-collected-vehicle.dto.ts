import { PartialType } from '@nestjs/mapped-types';
import { CreateCollectedVehicleDto } from './create-collected-vehicle.dto';

export class UpdateCollectedVehicleDto extends PartialType(CreateCollectedVehicleDto) {}

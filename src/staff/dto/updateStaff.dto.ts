import { PartialType } from '@nestjs/mapped-types';
import { CreateStaffDto } from './createStaff.dto';

export class UpdateStaffDto extends PartialType(CreateStaffDto) {
  // This class inherats all the fieds of the parent class, but the field are optional.
}

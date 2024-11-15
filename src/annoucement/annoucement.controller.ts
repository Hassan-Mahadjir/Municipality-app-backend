import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AnnoucementService } from './annoucement.service';
import { CreateAnnoucementDto } from './dto/create-annoucement.dto';
import { UpdateAnnoucementDto } from './dto/update-annoucement.dto';
import { PaginationDTO } from 'src/department/dto/pagination.dto';

@Controller('annoucement')
export class AnnoucementController {
  constructor(private readonly annoucementService: AnnoucementService) {}

  @Post()
  create(@Body() createAnnoucementDto: CreateAnnoucementDto) {
    return this.annoucementService.create(createAnnoucementDto);
  }

  @Get()
  findAll(@Query() paginationDTO: PaginationDTO) {
    return this.annoucementService.findAll(paginationDTO);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.annoucementService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAnnoucementDto: UpdateAnnoucementDto,
  ) {
    return this.annoucementService.update(+id, updateAnnoucementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.annoucementService.remove(+id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Public } from 'src/auth/decorators/public.decorators';
import { ParseIdPipe } from 'src/user/pipes/paraseIdPipe';

@Controller('request')
export class RequestController {
  constructor(private requestService: RequestService) {}

  @Post(':id')
  create(
    @Body() createRequestDto: CreateRequestDto,
    @Param('id', ParseIdPipe) id,
  ) {
    return this.requestService.create(createRequestDto, id);
  }

  @Public()
  @Get()
  findAll() {
    return this.requestService.findAll();
  }

  @Get('/user-requests/:id')
  findUseRequest(@Param('id', ParseIdPipe) id) {
    return this.requestService.findUserRequests(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestService.update(+id, updateRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestService.remove(+id);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'src/entities/request.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request) private RequestRepo: Repository<Request>,
  ) {}
  create(createRequestDto: CreateRequestDto) {
    return 'This action adds a new request';
  }

  findAll(id: number) {
    const resposne = this.RequestRepo.findOne({ where: { id: id } });

    if (!resposne) throw new NotFoundException();

    return resposne;
  }

  findOne(id: number) {
    return `This action returns a #${id} request`;
  }

  update(id: number, updateRequestDto: UpdateRequestDto) {
    return `This action updates a #${id} request`;
  }

  remove(id: number) {
    return `This action removes a #${id} request`;
  }
}

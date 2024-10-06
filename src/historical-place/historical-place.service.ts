import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoricalPlace } from '../entities/historical-place.entity';

@Injectable()
export class HistoricalPlaceService {
  constructor(
    @InjectRepository(HistoricalPlace)
    private historicalPlaceRepository: Repository<HistoricalPlace>,
  ) {}

  findAll(): Promise<HistoricalPlace[]> {
    return this.historicalPlaceRepository.find();
  }

  findOne(id: string): Promise<HistoricalPlace> {
    return this.historicalPlaceRepository.findOneBy({ id: BigInt(id) });
  }

  create(historicalPlace: HistoricalPlace): Promise<HistoricalPlace> {
    return this.historicalPlaceRepository.save(historicalPlace);
  }

  async remove(id: string): Promise<void> {
    await this.historicalPlaceRepository.delete(id);
  }
}

import { Module } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthController } from './health.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pharmacy } from 'src/entities/pharmacy.entity';
import { Hospital } from 'src/entities/hospitals.entity';

@Module({
  controllers: [HealthController],
  providers: [HealthService],
  imports:[TypeOrmModule.forFeature([Pharmacy,Hospital])]
})
export class HealthModule {}

import { Test, TestingModule } from '@nestjs/testing';
import { CollectedVehicleService } from './collected-vehicle.service';

describe('CollectedVehicleService', () => {
  let service: CollectedVehicleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CollectedVehicleService],
    }).compile();

    service = module.get<CollectedVehicleService>(CollectedVehicleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

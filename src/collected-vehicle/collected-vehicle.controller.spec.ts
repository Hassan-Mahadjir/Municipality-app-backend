import { Test, TestingModule } from '@nestjs/testing';
import { CollectedVehicleController } from './collected-vehicle.controller';
import { CollectedVehicleService } from './collected-vehicle.service';

describe('CollectedVehicleController', () => {
  let controller: CollectedVehicleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollectedVehicleController],
      providers: [CollectedVehicleService],
    }).compile();

    controller = module.get<CollectedVehicleController>(CollectedVehicleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

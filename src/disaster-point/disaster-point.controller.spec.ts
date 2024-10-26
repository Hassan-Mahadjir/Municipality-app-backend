import { Test, TestingModule } from '@nestjs/testing';
import { DisasterPointController } from './disaster-point.controller';
import { DisasterPointService } from './disaster-point.service';

describe('DisasterPointController', () => {
  let controller: DisasterPointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DisasterPointController],
      providers: [DisasterPointService],
    }).compile();

    controller = module.get<DisasterPointController>(DisasterPointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

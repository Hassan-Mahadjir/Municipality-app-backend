import { Test, TestingModule } from '@nestjs/testing';
import { DisasterPointService } from './disaster-point.service';

describe('DisasterPointService', () => {
  let service: DisasterPointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DisasterPointService],
    }).compile();

    service = module.get<DisasterPointService>(DisasterPointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

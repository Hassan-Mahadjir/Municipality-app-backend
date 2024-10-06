import { Test, TestingModule } from '@nestjs/testing';
import { HistoricalPlaceController } from './historical-place.controller';
import { HistoricalPlaceService } from './historical-place.service';
import { HistoricalPlace } from '../entities/historical-place.entity';
import { mockDeep, DeepMocked } from 'jest-mock-extended';

describe('HistoricalPlaceController', () => {
  let controller: HistoricalPlaceController;
  let service: DeepMocked<HistoricalPlaceService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoricalPlaceController],
      providers: [
        {
          provide: HistoricalPlaceService,
          useValue: mockDeep<HistoricalPlaceService>(),
        },
      ],
    }).compile();

    controller = module.get<HistoricalPlaceController>(HistoricalPlaceController);
    service = module.get(HistoricalPlaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of HistoricalPlace', async () => {
      const result: HistoricalPlace[] = [];
      service.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a HistoricalPlace', async () => {
      const id = '1';
      const result: HistoricalPlace = { id: BigInt(id), name: 'Test Place', weekends: false, weekdays: true, history: 'Some history', openWeekdays: '9:00', closeWeekdays: '17:00', openWeekends: '10:00', closeWeekends: '16:00', serviceId: BigInt('1') };
      service.findOne.mockResolvedValue(result);

      expect(await controller.findOne(id)).toBe(result);
    });
  });

  describe('create', () => {
    it('should return a newly created HistoricalPlace', async () => {
      const createDto: HistoricalPlace = { id: BigInt('1'), name: 'New Place', weekends: false, weekdays: true, history: 'New history', openWeekdays: '8:00', closeWeekdays: '18:00', openWeekends: '9:00', closeWeekends: '17:00', serviceId: BigInt('1') };
      service.create.mockResolvedValue(createDto);

      expect(await controller.create(createDto)).toBe(createDto);
    });
  });

  describe('remove', () => {
    it('should delete a HistoricalPlace by id', async () => {
      const id = '1';
      service.remove.mockResolvedValue();

      await controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});

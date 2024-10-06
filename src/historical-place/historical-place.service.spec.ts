import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { HistoricalPlaceService } from './historical-place.service';
import { HistoricalPlace } from '../entities/historical-place.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockDeep, DeepMocked } from 'jest-mock-extended';

describe('HistoricalPlaceService', () => {
  let service: HistoricalPlaceService;
  let repository: DeepMocked<Repository<HistoricalPlace>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistoricalPlaceService,
        {
          provide: getRepositoryToken(HistoricalPlace),
          useValue: mockDeep<Repository<HistoricalPlace>>(),
        },
      ],
    }).compile();

    service = module.get<HistoricalPlaceService>(HistoricalPlaceService);
    repository = module.get(getRepositoryToken(HistoricalPlace));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of HistoricalPlace', async () => {
      const result: HistoricalPlace[] = [];
      repository.find.mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a HistoricalPlace', async () => {
      const id = '1';
      const result: HistoricalPlace = { id: BigInt(id), name: 'Test Place', weekends: false, weekdays: true, history: 'Some history', openWeekdays: '9:00', closeWeekdays: '17:00', openWeekends: '10:00', closeWeekends: '16:00', serviceId: BigInt('1') };
      repository.findOneBy.mockResolvedValue(result);

      expect(await service.findOne(id)).toBe(result);
    });
  });

  describe('create', () => {
    it('should return a newly created HistoricalPlace', async () => {
      const createDto: HistoricalPlace = { id: BigInt('1'), name: 'New Place', weekends: false, weekdays: true, history: 'New history', openWeekdays: '8:00', closeWeekdays: '18:00', openWeekends: '9:00', closeWeekends: '17:00', serviceId: BigInt('1') };
      repository.save.mockResolvedValue(createDto);

      expect(await service.create(createDto)).toBe(createDto);
    });
  });

  describe('remove', () => {
    it('should delete a HistoricalPlace by id', async () => {
      const id = '1';
      repository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(id);
      expect(repository.delete).toHaveBeenCalledWith(BigInt(id));
    });
  });
});

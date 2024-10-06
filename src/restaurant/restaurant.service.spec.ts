import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantService } from './restaurant.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Restaurant } from '../entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';  // Import DTO

describe('RestaurantService', () => {
  let service: RestaurantService;
  let repository: Repository<Restaurant>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantService,
        {
          provide: getRepositoryToken(Restaurant),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
    repository = module.get<Repository<Restaurant>>(getRepositoryToken(Restaurant));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of restaurants', async () => {
    jest.spyOn(repository, 'find').mockResolvedValue([]);
    const result = await service.findAll();
    expect(result).toEqual([]);
  });

  it('should return one restaurant', async () => {
    const restaurant = { id: BigInt(1), name: 'Test Restaurant', phone: '1234567890', openWeekdays: '09:00', closeWeekdays: '17:00', openWeekends: '10:00', closeWeekends: '16:00', serviceId: BigInt(1), weekdays: true, weekends: false } as Restaurant;
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(restaurant);
    const result = await service.findOne(BigInt(1));
    expect(result).toEqual(restaurant);
  });

  it('should create a restaurant', async () => {
    const dto: CreateRestaurantDto = {
      name: 'New Restaurant',
      weekdays: true,
      weekends: false,
      phone: '1234567890',
      openWeekdays: '09:00',
      closeWeekdays: '17:00',
      openWeekends: '10:00',
      closeWeekends: '16:00',
      serviceId: BigInt(1),
    };
    const restaurant = { id: BigInt(1), ...dto } as Restaurant;
    jest.spyOn(repository, 'save').mockResolvedValue(restaurant);
    const result = await service.create(dto);
    expect(result).toEqual(restaurant);
  });

  it('should update a restaurant', async () => {
    const dto: Partial<CreateRestaurantDto> = { name: 'Updated Restaurant' };
    const restaurant = { id: BigInt(1), name: 'Updated Restaurant', phone: '1234567890', openWeekdays: '09:00', closeWeekdays: '17:00', openWeekends: '10:00', closeWeekends: '16:00', serviceId: BigInt(1), weekdays: true, weekends: false } as Restaurant;
    
    // Mocking the `update` method to return an object with `affected`, `raw`, and `generatedMaps`
    const updateResult: UpdateResult = {
      affected: 1,
      raw: {},
      generatedMaps: [],
    };

    jest.spyOn(repository, 'update').mockResolvedValue(updateResult);
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(restaurant);
    
    const result = await service.update(BigInt(1), dto);
    expect(result).toEqual(restaurant);
  });

  it('should delete a restaurant', async () => {
    // Mocking the `delete` method to return an object with `affected` and `raw`
    const deleteResult: DeleteResult = {
      affected: 1,
      raw: {},
    };

    jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);
    const result = await service.delete(BigInt(1));
    expect(result).toEqual({ success: true });
  });
});

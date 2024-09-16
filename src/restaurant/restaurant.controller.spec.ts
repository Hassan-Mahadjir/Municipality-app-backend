import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto'; // Ensure this import is correct

describe('RestaurantController', () => {
  let controller: RestaurantController;
  let service: RestaurantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantController],
      providers: [
        {
          provide: RestaurantService,
          useValue: {
            findAll: jest.fn(() => []),
            findOne: jest.fn((id: bigint) => ({ id, name: 'Test Restaurant' })),
            create: jest.fn((dto: CreateRestaurantDto) => ({ id: BigInt(1), ...dto })),
            update: jest.fn((id: bigint, dto: any) => ({ id, ...dto })),
            delete: jest.fn((id: bigint) => ({ success: true })),
          },
        },
      ],
    }).compile();

    controller = module.get<RestaurantController>(RestaurantController);
    service = module.get<RestaurantService>(RestaurantService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of restaurants', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([]);
  });

  it('should return one restaurant', async () => {
    const result = await controller.findOne('1'); // Make sure to handle the conversion properly in your service
    expect(result).toEqual({ id: BigInt(1), name: 'Test Restaurant' });
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
      closeWeekends: '15:00',
      serviceId: BigInt(1),
    };
    const result = await controller.create(dto);
    expect(result).toEqual({ id: BigInt(1), ...dto });
  });

  it('should update a restaurant', async () => {
    const dto = { name: 'Updated Restaurant' }; // Adjust as needed
    const result = await controller.update('1', dto);
    expect(result).toEqual({ id: BigInt(1), ...dto });
  });

  it('should delete a restaurant', async () => {
    const result = await controller.delete('1');
    expect(result).toEqual({ success: true });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { Image } from '../entities/image.entity';

describe('ImageController', () => {
  let controller: ImageController;
  let service: jest.Mocked<ImageService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageController],
      providers: [
        {
          provide: ImageService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ImageController>(ImageController);
    service = module.get(ImageService) as jest.Mocked<ImageService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of Image', async () => {
      const result: Image[] = [];
      service.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return an Image', async () => {
      const id = '1';
      const result: Image = { id: BigInt(id), imageUrl: 'http://example.com/image.jpg', subServiceId: BigInt('1') };
      service.findOne.mockResolvedValue(result);

      expect(await controller.findOne(id)).toBe(result);
    });
  });

  describe('create', () => {
    it('should return a newly created Image', async () => {
      const createDto: Image = { id: BigInt('1'), imageUrl: 'http://example.com/image.jpg', subServiceId: BigInt('1') };
      service.create.mockResolvedValue(createDto);

      expect(await controller.create(createDto)).toBe(createDto);
    });
  });

  describe('remove', () => {
    it('should call remove on the service', async () => {
      const id = '1';
      service.remove.mockResolvedValue(undefined);

      await controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});

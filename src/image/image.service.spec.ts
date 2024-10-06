import { Test, TestingModule } from '@nestjs/testing';
import { Repository, DeleteResult } from 'typeorm';
import { ImageService } from './image.service';
import { Image } from '../entities/image.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ImageService', () => {
  let service: ImageService;
  let repository: jest.Mocked<Repository<Image>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageService,
        {
          provide: getRepositoryToken(Image),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ImageService>(ImageService);
    repository = module.get(getRepositoryToken(Image));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of Image', async () => {
      const result: Image[] = [];
      repository.find.mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return an Image', async () => {
      const id = '1';
      const result: Image = { id: BigInt(id), imageUrl: 'http://example.com/image.jpg', subServiceId: BigInt('1') };
      repository.findOneBy.mockResolvedValue(result);

      expect(await service.findOne(id)).toBe(result);
    });
  });

  describe('create', () => {
    it('should return a newly created Image', async () => {
      const createDto: Image = { id: BigInt('1'), imageUrl: 'http://example.com/image.jpg', subServiceId: BigInt('1') };
      repository.save.mockResolvedValue(createDto);

      expect(await service.create(createDto)).toBe(createDto);
    });
  });

  describe('remove', () => {
    it('should delete an Image by id', async () => {
      const id = '1';
      const deleteResult: DeleteResult = { 
        raw: {}, 
        affected: 1 
      };
      repository.delete.mockResolvedValue(deleteResult);

      await service.remove(id);
      expect(repository.delete).toHaveBeenCalledWith(BigInt(id));
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from '../entities/comment.entity';

describe('CommentController', () => {
  let controller: CommentController;
  let service: jest.Mocked<CommentService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CommentController>(CommentController);
    service = module.get(CommentService) as jest.Mocked<CommentService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of Comment', async () => {
      const result: Comment[] = [];
      service.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a Comment', async () => {
      const id = '1';
      const result: Comment = { id: BigInt(id), body: 'Test comment', recommendation: 5, createAt: new Date(), userId: BigInt('1'), subServiceId: BigInt('1') };
      service.findOne.mockResolvedValue(result);

      expect(await controller.findOne(id)).toBe(result);
    });
  });

  describe('create', () => {
    it('should return a newly created Comment', async () => {
      const createDto: Comment = { id: BigInt('1'), body: 'Test comment', recommendation: 5, createAt: new Date(), userId: BigInt('1'), subServiceId: BigInt('1') };
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

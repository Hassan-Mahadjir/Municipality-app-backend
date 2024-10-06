import { Test, TestingModule } from '@nestjs/testing';
import { Repository, DeleteResult } from 'typeorm';
import { CommentService } from './comment.service';
import { Comment } from '../entities/comment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CommentService', () => {
  let service: CommentService;
  let repository: jest.Mocked<Repository<Comment>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(Comment),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    repository = module.get(getRepositoryToken(Comment)) as jest.Mocked<Repository<Comment>>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of Comment', async () => {
      const result: Comment[] = [];
      repository.find.mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a Comment', async () => {
      const id = '1';
      const result: Comment = { id: BigInt(id), body: 'Test comment', recommendation: 5, createAt: new Date(), userId: BigInt('1'), subServiceId: BigInt('1') };
      repository.findOneBy.mockResolvedValue(result);

      expect(await service.findOne(id)).toBe(result);
    });
  });

  describe('create', () => {
    it('should return a newly created Comment', async () => {
      const createDto: Comment = { id: BigInt('1'), body: 'Test comment', recommendation: 5, createAt: new Date(), userId: BigInt('1'), subServiceId: BigInt('1') };
      repository.save.mockResolvedValue(createDto);

      expect(await service.create(createDto)).toBe(createDto);
    });
  });

  describe('remove', () => {
    it('should call remove on the service', async () => {
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

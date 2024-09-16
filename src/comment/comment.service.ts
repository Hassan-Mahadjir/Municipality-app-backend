import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  findAll(): Promise<Comment[]> {
    return this.commentRepository.find();
  }

  findOne(id: string): Promise<Comment> {
    return this.commentRepository.findOneBy({ id: BigInt(id) });
  }

  create(comment: Comment): Promise<Comment> {
    return this.commentRepository.save(comment);
  }

  async remove(id: string): Promise<void> {
    await this.commentRepository.delete(id);
  }
}

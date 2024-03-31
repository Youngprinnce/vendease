import { Comment } from '../models/comment.models';
import { PrismaService } from '../prisma/prisma.service';
import { AddCommentDto } from '../episodes/dto/add-comment.dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Omit<Comment, 'id' | 'episode' | 'episodeId'>[]> {
    return await this.prisma.comment.findMany({
      orderBy: {
        created_at: 'desc',
      },
      select: {
        comment: true,
        ip_address_location: true,
        created_at: true,
      },
    });
  }

  async addComment(addCommentDto: AddCommentDto): Promise<Comment> {
    try {
      return await this.prisma.comment.create({
        data: {
          comment: addCommentDto.comment,
          ip_address_location: addCommentDto.ip_address_location,
          episode: {
            connect: {
              id: addCommentDto.episodeId,
            },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while creating a comment.');
    }
  }
}

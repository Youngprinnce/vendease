import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { PrismaService } from '../prisma/prisma.service';
import { AddCommentDto } from '../episodes/dto/add-comment.dto';
import { Comment } from '../models/comment.models';
import { InternalServerErrorException } from '@nestjs/common';

describe('CommentsService', () => {
  let service: CommentsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: PrismaService,
          useValue: {
            comment: {
              findMany: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of comments', async () => {

      const comments: Omit<Comment, 'id' | 'episode' | 'episodeId'>[] = [
        { comment: 'First comment', ip_address_location: 'Location 1', created_at: new Date() },
        { comment: 'Second comment', ip_address_location: 'Location 2', created_at: new Date() },
      ];

      jest.spyOn(prismaService.comment, 'findMany').mockResolvedValue(comments as any);

      const result = await service.findAll();

      expect(result).toEqual(comments);
    });
  });

  describe('addComment', () => {
    it('should add a comment', async () => {
      const addCommentDto: AddCommentDto = {
        comment: 'Test comment',
        ip_address_location: 'Test location',
        episodeId: '1',
      };
      const createdComment: Comment = {
        id: '1',
        comment: addCommentDto.comment,
        ip_address_location: addCommentDto.ip_address_location,
        episodeId: addCommentDto.episodeId,
        created_at: new Date(),
      };

      jest.spyOn(prismaService.comment, 'create').mockResolvedValue(createdComment as any);

      const result = await service.addComment(addCommentDto);

      expect(result).toEqual(createdComment);
    });

    it('should throw InternalServerErrorException if an error occurs', async () => {

      const addCommentDto: AddCommentDto = {
        comment: 'Test comment',
        ip_address_location: 'Test location',
        episodeId: '1',
      };

      jest.spyOn(prismaService.comment, 'create').mockRejectedValue(new Error());

      await expect(service.addComment(addCommentDto)).rejects.toThrowError(InternalServerErrorException);
    });
  });
});

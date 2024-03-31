import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from '../models/comment.models';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [CommentsService, PrismaService, ConfigService],

    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of comments', async () => {

      const comments: Comment[] = [
        { id: '1', comment: 'First comment', episodeId: '1', ip_address_location: 'Location 1', created_at: new Date() },
        { id: '2', comment: 'Second comment', episodeId: '1', ip_address_location: 'Location 2', created_at: new Date() },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(comments);

      const result = await controller.findAll();

      expect(result).toEqual(comments);
    });
  });
});

import { Comment } from '../models/comment.models';
import { EpisodesService } from './episodes.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AddCommentDto } from './dto/add-comment.dto';
import { Character } from '../models/character.models';
import { PrismaService } from '../prisma/prisma.service';
import { CommentsService } from '../comments/comments.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('EpisodesService', () => {
  let service: EpisodesService;
  let prismaService: PrismaService;
  let commentsService: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EpisodesService,
        {
          provide: PrismaService,
          useValue: {
            episode: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            character: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: CommentsService,
          useValue: {
            addComment: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EpisodesService>(EpisodesService);
    prismaService = module.get<PrismaService>(PrismaService);
    commentsService = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
    expect(commentsService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of episodes', async () => {
      const expectedEpisodes = [];
      jest.spyOn(prismaService.episode, 'findMany').mockResolvedValue(expectedEpisodes);
      const episodes = await service.findAll();
      expect(episodes).toEqual(expectedEpisodes);
    });

    it('should throw an error if unable to fetch episodes', async () => {
      jest.spyOn(prismaService.episode, 'findMany').mockRejectedValue(new Error('Error'));
      await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('addComment', () => {
      const addCommentDto: AddCommentDto = {
          comment: 'comment',
          episodeId: '1',
          ip_address_location: '127.0.0.1',
      };
      const comment: Comment = {
          id: '1', 
          comment: addCommentDto.comment,
          ip_address_location: addCommentDto.ip_address_location,
          created_at: new Date(),
          episodeId: '1'
      };
      it('should add a comment to an episode', async () => {
          
          jest.spyOn(commentsService, 'addComment').mockResolvedValue(comment);
          const result = await service.addComment(addCommentDto);
          expect(result).toEqual(comment);
      });
  
      it('should throw an error if unable to add a comment', async () => {
          jest.spyOn(commentsService, 'addComment').mockRejectedValue(new Error('Error'));
          await expect(service.addComment(comment)).rejects.toThrow(InternalServerErrorException);
      });
  });

  describe('getCharacterEpisodes', () => {
      const characterResult: Character[] = [
          {
          id: "1",
          first_name: "John",
          last_name: "Doe",
          state_of_origin: "Lagos",
          gender: "MALE",
          status: "ACTIVE",
          created_at: new Date(),
          locationId: "1",
          },
      ];
      it('should return an array of episodes', async () => {
          const characterId = '1';
          const expectedEpisodes = [];
          jest.spyOn(prismaService.character, 'findUnique').mockResolvedValue(characterResult[0]);
          jest.spyOn(prismaService.episode, 'findMany').mockResolvedValue(expectedEpisodes);
          const episodes = await service.getCharacterEpisodes(characterId);
          expect(episodes).toEqual(expectedEpisodes);
      });

      it('should throw an error if character is not found', async () => {
          const characterId = '1';
          jest.spyOn(prismaService.character, 'findUnique').mockResolvedValue(null);
          await expect(service.getCharacterEpisodes(characterId)).rejects.toThrow(NotFoundException);
      });
  });

  describe('createEpisode', () => {
      it('should create an episode', async () => {
          const createEpisodeDto = {
              name: 'Episode 1',
              release_date: new Date(),
              episode_code: '1'
          };
          const episode = {
              id: '1',
              name: createEpisodeDto.name,
              release_date: createEpisodeDto.release_date,
              episode_code: createEpisodeDto.episode_code
          };
          jest.spyOn(prismaService.episode, 'create').mockResolvedValue(episode as any);
          const result = await service.createEpisode(createEpisodeDto);
          expect(result).toEqual(episode);
      });

      it('should throw an error if unable to create an episode', async () => {
          const createEpisodeDto = {
              name: 'Episode 1',
              release_date: new Date(),
              episode_code: '1'
          };
          jest.spyOn(prismaService.episode, 'create').mockRejectedValue(new Error('Error'));
          await expect(service.createEpisode(createEpisodeDto)).rejects.toThrow(InternalServerErrorException);
      });
  });
});


import { Request } from 'express';
import { Comment } from '../models/comment.models';
import { EpisodesService } from './episodes.service';
import { Test, TestingModule } from '@nestjs/testing';
import { EpisodesController } from './episodes.controller';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { AddCommentDto, CreateCommentDto } from './dto/add-comment.dto';

describe('EpisodesController', () => {
  let controller: EpisodesController;
  let episodesService: EpisodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EpisodesController],
      providers: [
        {
          provide: EpisodesService,
          useValue: {
            findAll: jest.fn(),
            addComment: jest.fn(),
            getCharacterEpisodes: jest.fn(),
            createEpisode: jest.fn(),
            assignCharacters: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EpisodesController>(EpisodesController);
    episodesService = module.get<EpisodesService>(EpisodesService);
  });

  const episodes = [
    { 
      id: 'episodeId1',
      name: 'Episode 1',
      release_date: new Date(),
      episode_code: 'E01',
      created_at: new Date(),
      _count: {
        "episode_comments": 0
      },
      characters: []
    },
    { 
      id: 'episodeId2',
      name: 'Episode 2',
      release_date: new Date(),
      episode_code: 'E02',
      created_at: new Date(),
      _count: {
        "episode_comments": 0
      },
      characters: []
    }
  ];

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

describe('findAll', () => {
    it('should return an array of episodes', async () => {
        jest.spyOn(episodesService, 'findAll').mockResolvedValue(episodes);

        const result = await controller.findAll();
        expect(result).toEqual(episodes);
    });
});

  describe('addComment', () => {
    it('should add a comment to an episode', async () => {
      const createCommentDto: CreateCommentDto = { comment: 'Test comment' };
      const addCommentDto: AddCommentDto = {
        comment: createCommentDto.comment,
        episodeId: '1',
        ip_address_location: '127.0.0.1',
      };
      const comment: Comment = {
        id: '1', comment: createCommentDto.comment,
        ip_address_location: '',
        created_at: new Date(),
        episodeId: '1'
      };

      const req = { ip: '127.0.0.1' } as Request;
      jest.spyOn(episodesService, 'addComment').mockResolvedValue(comment);

      const result = await controller.addComment('1', createCommentDto, req);
      expect(result).toEqual(comment);
    });
  });

  describe('getCharacterEpisodes', () => {
    it('should return episodes of a character', async () => {
      const characterId = '1';
      jest.spyOn(episodesService, 'getCharacterEpisodes').mockResolvedValue(episodes);

      const result = await controller.getCharacterEpisodes(characterId);
      expect(result).toEqual(episodes);
    });
  });

  describe('createEpisode', () => {
    it('should create an episode', async () => {
      const createEpisodeDto: CreateEpisodeDto = {
          name: 'Episode 1',
          release_date: new Date(),
          episode_code: '1'
      };
      jest.spyOn(episodesService, 'createEpisode').mockResolvedValue(episodes[0]);

      const result = await controller.createEpisode(createEpisodeDto);
      expect(result).toEqual(episodes[0]);
    });
  });
});

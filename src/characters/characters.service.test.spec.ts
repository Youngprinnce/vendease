import { Test, TestingModule } from '@nestjs/testing';
import { CharactersService } from './characters.service';
import { PrismaService } from '../prisma/prisma.service';
import { LocationsService } from '../locations/locations.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { AssignEpisodesDto } from './dto/assign-episodes.dto';
import { Gender } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { Location } from '../models/location.models';
import { Character } from '../models/character.models';
import { CharacterSortByEnum, CharacterSortOrderEnum } from '../common/util';

describe('CharactersService', () => {
  let service: CharactersService;
  let prismaService: PrismaService;
  let locationsService: LocationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharactersService,
        {
          provide: PrismaService,
          useValue: {
            character: {
              findMany: jest.fn(),
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            episode: {
              findMany: jest.fn(),
            },
          },
        },
        {
          provide: LocationsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CharactersService>(CharactersService);
    prismaService = module.get<PrismaService>(PrismaService);
    locationsService = module.get<LocationsService>(LocationsService);
  });

  const character: CreateCharacterDto = {
    first_name: "John",
    last_name: "Doe",
    state_of_origin: "Lagos",
    gender: "MALE",
    status: "ACTIVE",
    locationId: "1",
  };

  const episodes = [
    { 
      id: 'episodeId1',
      name: 'Episode 1',
      release_date: new Date(),
      episode_code: 'E01',
      created_at: new Date(),
    },
    { 
      id: 'episodeId2',
      name: 'Episode 2',
      release_date: new Date(),
      episode_code: 'E02',
      created_at: new Date(),
    }
  ];

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

  const location: Location = {
    id: '1',
    name: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
    created_at: new Date(),
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCharacter', () => {
    it('should create a character', async () => {
      jest.spyOn(locationsService, 'findOne').mockResolvedValue(location);
      jest.spyOn(prismaService.character, 'create').mockResolvedValue(character as any);

      const result = await service.createCharacter(character);

      expect(result).toEqual(character);
    });

    it('should throw an error if location is not found', async () => {
      jest.spyOn(locationsService, 'findOne').mockResolvedValue(null);

      await expect(service.createCharacter(character)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('assignEpisodes', () => {
    it('should assign episodes to a character', async () => {
      const characterId = '1';
      const assignEpisodesDto: AssignEpisodesDto = { episodeIds: ['episodeId1', 'episodeId2'] };
      jest.spyOn(prismaService.character, 'findUnique').mockResolvedValue(characterResult[0]);
      jest.spyOn(prismaService.episode, 'findMany').mockResolvedValue(episodes);
      jest.spyOn(prismaService.character, 'update').mockResolvedValue(characterResult[0]);

      await service.assignEpisodes(characterId, assignEpisodesDto);

      expect(prismaService.character.update).toHaveBeenCalledWith({
        where: { id: characterId },
        data: {
          episodes: {
            connect: [{ id: 'episodeId1' }, { id: 'episodeId2' }],
          },
        },
      });
    });

    it('should throw NotFoundException if character not found', async () => {
      jest.spyOn(prismaService.character, 'findUnique').mockResolvedValue(null);

      await expect(service.assignEpisodes('1', { episodeIds: ['episodeId1'] })).rejects.toThrowError(NotFoundException);
    });

    it('should throw NotFoundException if one or more episodes not found', async () => {
      const characterId = '1';
      const assignEpisodesDto: AssignEpisodesDto = { episodeIds: ['episodeId1', 'episodeId2', 'episodeId3'] };
      jest.spyOn(prismaService.character, 'findUnique').mockResolvedValue(characterResult[0]);
      jest.spyOn(prismaService.episode, 'findMany').mockResolvedValue(episodes);

      await expect(service.assignEpisodes(characterId, assignEpisodesDto)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of characters', async () => {
      jest.spyOn(prismaService.character, 'findMany').mockResolvedValue(characterResult);

      const result = await service.findAll(CharacterSortByEnum.NAME, CharacterSortOrderEnum.ASC, Gender.MALE, "new york");

      expect(result).toEqual(characterResult);
    });
  });
});

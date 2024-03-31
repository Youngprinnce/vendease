import { Gender } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Character } from '../models/character.models';
import { PrismaService } from '../prisma/prisma.service';
import { CharacterSortByEnum, CharacterSortOrderEnum } from '../common/util';
import { CreateCharacterDto } from './dto/create-character.dto';
import { LocationsService } from '../locations/locations.service';
import { AssignEpisodesDto } from './dto/assign-episodes.dto';

@Injectable()
export class CharactersService {
  constructor(
    private prisma: PrismaService,
    private locationsService: LocationsService,
  ) {}

  async findAll(
    sortBy?: CharacterSortByEnum, 
    sortOrder?: CharacterSortOrderEnum, 
    filterByGender?: Gender, 
    filterByLocation?: string
  ): Promise<Character[]> {
    let where = {};

    if (filterByGender) {
      where = { ...where, gender: filterByGender };
    }

    if (filterByLocation) {
      where = {
        ...where,
        location: {
          name: {
            contains: filterByLocation,
            mode: 'insensitive',
          },
        },
      };
    }

    let orderBy = {};

    if (sortBy === CharacterSortByEnum.NAME) {
      orderBy = { first_name: sortOrder };
    } else if (sortBy === CharacterSortByEnum.GENDER) {
      orderBy = { gender: sortOrder };
    } else {
      orderBy = { first_name: 'asc' };
    }

    return this.prisma.character.findMany({
      where,
      orderBy,
      include: {
        episodes: true,
      },
    });
  }

  async createCharacter(createCharacterDto: CreateCharacterDto): Promise<Character> {
    const location = await this.locationsService.findOne(createCharacterDto.locationId);
    if (!location) {
      throw new NotFoundException(`Location with id ${createCharacterDto.locationId} not found`);
    }

    return this.prisma.character.create({ data: createCharacterDto });
  }
  

  async assignEpisodes(characterId: string, assignEpisodesDto: AssignEpisodesDto) {
    const character = await this.prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      throw new NotFoundException('Character not found.');
    }

    const episodes = await this.prisma.episode.findMany({
      where: {
        id: {
          in: assignEpisodesDto.episodeIds,
        },
      },
    });

    if (episodes.length !== assignEpisodesDto.episodeIds.length) {
      throw new NotFoundException('One or more episodes not found.');
    }

    await this.prisma.character.update({
      where: { id: characterId },
      data: {
        episodes: {
          connect: assignEpisodesDto.episodeIds.map((id) => ({ id })),
        },
      },
    });
  }
}

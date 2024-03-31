import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CommentsService } from '../comments/comments.service';
import { AddCommentDto } from './dto/add-comment.dto';
import { Episode } from '../models/episodes.models';
import { Comment } from '../models/comment.models';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { AssignCharactersDto } from './dto/assign-characters.dto';

@Injectable()
export class EpisodesService {
  constructor(
    private prisma: PrismaService,
    private readonly commentsService: CommentsService,
  ) {}

  async findAll() {
    try {
      return await this.prisma.episode.findMany({
        orderBy: { release_date: 'asc' },
        include: {
          _count: {
            select: { episode_comments: true },
          },
          characters: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while fetching episodes.');
    }
  }

  async addComment(
    addCommentDto: AddCommentDto,
  ): Promise<Comment> {
    try {
      return await this.commentsService.addComment(addCommentDto);
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while adding a comment.');
    }
  }

  async getCharacterEpisodes(characterId: string): Promise<Episode[]> {
    const character = await this.prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      throw new NotFoundException('Character not found.');
    }

    return this.prisma.episode.findMany({
      where: {
        characters: {
          some: {
            id: characterId,
          },
        },
      },
    });
  }

  async createEpisode(createEpisodeDto: CreateEpisodeDto): Promise<Episode> {
    try {
      return await this.prisma.episode.create({ data: createEpisodeDto });
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while creating an episode.');
    }
  }

  async assignCharacters(id: string, assignCharactersDto: AssignCharactersDto) {
    const episode = await this.prisma.episode.findUnique({
      where: { id },
    });

    if (!episode) {
      throw new NotFoundException(`Episode with id ${id} not found`);
    }

    const characters = await this.prisma.character.findMany({
      where: {
        id: {
          in: assignCharactersDto.characterIds,
        },
      },
    });

    if (characters.length === 0) {
      throw new NotFoundException('One or more characters not found.');
    }

    await this.prisma.episode.update({
      where: { id },
      data: {
        characters: {
          connect: characters.map((character) => ({ id: character.id })),
        },
      },
    });
  }
}

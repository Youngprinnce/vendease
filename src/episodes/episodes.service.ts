import { Comment } from '../models/comment.models';
import { Episode } from '../models/episodes.models';
import { AddCommentDto } from './dto/add-comment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { CommentsService } from '../comments/comments.service';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

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
}

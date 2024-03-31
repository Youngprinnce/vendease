import { Request } from 'express';
import { Comment } from '../models/comment.models';
import { Episode } from '../models/episodes.models';
import { EpisodesService } from './episodes.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { GetEpisodesDto } from './dto/get-episodes-response';
import { InvalidUUIDPipe } from '../common/pipes/uuid.pipes';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddCommentDto, CreateCommentDto } from './dto/add-comment.dto';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req } from '@nestjs/common';
@ApiTags('Episodes')
@Controller('episodes')
export class EpisodesController {
  constructor(private readonly episodesService: EpisodesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all episodes',
    type: () => GetEpisodesDto, isArray: true,
  })
  findAll() {
    return this.episodesService.findAll();
  }

  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Add a comment to an episode',
    type: () => Comment,
  })
  addComment(
    @Param('id', InvalidUUIDPipe) id: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ) {
    const addCommentDto = new AddCommentDto();
    addCommentDto.comment = createCommentDto.comment;
    addCommentDto.episodeId = id;
    addCommentDto.ip_address_location = req.ip;
    return this.episodesService.addComment(addCommentDto);
  }

  @Get('get-character-episodes/:characterId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: () => Episode, isArray: true, status: HttpStatus.OK})
  getCharacterEpisodes(
    @Param('characterId', InvalidUUIDPipe) characterId: string,
  ) {
    return this.episodesService.getCharacterEpisodes(characterId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create an episode',
    type: () => Episode,
  })
  createEpisode(
    @Body() createEpisodeDto: CreateEpisodeDto,
  ) {
    return this.episodesService.createEpisode(createEpisodeDto);
  }
}

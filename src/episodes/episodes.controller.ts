import { Comment } from '../models/comment.models';
import { EpisodesService } from './episodes.service';
import { Episode } from '../models/episodes.models';
import { AddCommentDto, CreateCommentDto } from './dto/add-comment.dto';
import { InvalidUUIDPipe } from '../common/pipes/uuid.pipes';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { AssignCharactersDto } from './dto/assign-characters.dto';
import { GetEpisodesDto } from './dto/get-episodes-response';

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

  @Post(':id/assign-characters')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Link characters to an episode',
  })
  linkCharacters(
    @Param('id', InvalidUUIDPipe) id: string,
    @Body() assignCharactersDto: AssignCharactersDto,
  ) {
    return this.episodesService.assignCharacters(id, assignCharactersDto);
  }
}

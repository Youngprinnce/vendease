import { Gender } from '@prisma/client';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { ApiOkResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CharacterSortByEnum, CharacterSortOrderEnum } from '../common/util';
import { CreateCharacterDto } from './dto/create-character.dto';
import { InvalidUUIDPipe } from '../common/pipes/uuid.pipes';
import { AssignEpisodesDto } from './dto/assign-episodes.dto';
import { Character } from '../models/character.models';

@ApiTags('Characters')
@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  @ApiOkResponse({ type: () => Character, isArray: true})
  @ApiQuery({ name: 'sortBy', required: false, enum: CharacterSortByEnum })
  @ApiQuery({ name: 'sortOrder', required: false, enum: CharacterSortOrderEnum })
  @ApiQuery({ name: 'filterByGender', required: false, enum: Gender })
  @ApiQuery({ name: 'filterByLocation', required: false, type: String })
  findAll(
    @Query('sortBy') sortBy: CharacterSortByEnum,
    @Query('sortOrder') sortOrder: CharacterSortOrderEnum,
    @Query('filterByGender') filterByGender: Gender,
    @Query('filterByLocation') filterByLocation: string,
  ) {
    return this.charactersService.findAll(sortBy, sortOrder, filterByGender, filterByLocation);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: () => Character })
  createCharacter(
    @Body() createCharacterDto: CreateCharacterDto,
  ) {
    return this.charactersService.createCharacter(createCharacterDto);
  }

  @Post(':id/assign-episodes')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Link episodes to a character',
  })
  linkCharacters(
    @Param('id', InvalidUUIDPipe) id: string,
    @Body() assignEpisodesDto: AssignEpisodesDto,
  ) {
    return this.charactersService.assignEpisodes(id, assignEpisodesDto);
  }
}

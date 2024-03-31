import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { Location } from '../models/location.models';
import { CreateLocationDto } from './dto/create-location.dto';

@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all locations',
    type: () => Location, isArray: true,
  })
  findAll() {
    return this.locationsService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create an location',
    type: () => Location,
  })
  createEpisode(
    @Body() createLocationDto: CreateLocationDto,
  ) {
    return this.locationsService.createLocation(createLocationDto);
  }
}

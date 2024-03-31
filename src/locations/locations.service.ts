import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Location } from '../models/location.models';
import { CreateLocationDto } from './dto/create-location.dto';

@Injectable()
export class LocationsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll() : Promise<Location[]> {
    try {
      return await this.prisma.location.findMany({});
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while fetching locations.');
    }
  }

  async createLocation(createLocationDto: CreateLocationDto): Promise<Location> {
    try {
      return await this.prisma.location.create({ data: createLocationDto });
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while creating location.');
    }
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.prisma.location.findUnique({
      where: {
        id,
      },
    });

    if (!location) {
      throw new NotFoundException(`Location with id ${id} not found`);
    }

    return location;
  }
}

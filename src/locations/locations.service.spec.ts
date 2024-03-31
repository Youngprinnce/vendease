import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Location } from 'src/models/location.models';
import { Gender } from '@prisma/client';
import { Character } from 'src/models/character.models';

describe('LocationsService', () => {
  let service: LocationsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        {
          provide: PrismaService,
          useValue: {
            location: {
              findMany: jest.fn(),
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

    const mockCharacter: Character = {
        id: "1",
        first_name: "John",
        last_name: "Doe",
        state_of_origin: "Lagos",
        gender: Gender.MALE,
        status: "ACTIVE",
        created_at: new Date(),
        locationId: "1",
    };

    const result: Location[] = [
    { id: '1', name: 'Location 1', latitude: 0, longitude: 0, created_at: new Date(), character: mockCharacter},
    { id: '2', name: 'Location 2', latitude: 1, longitude: 1, created_at: new Date(), character: mockCharacter},
    ];

  describe('findAll', () => {
    it('should return an array of locations', async () => {
      const expectedLocations = [];
      jest.spyOn(prisma.location, 'findMany').mockResolvedValue(expectedLocations);
      await expect(service.findAll()).resolves.toEqual(expectedLocations);
    });

    it('should throw an error if something goes wrong', async () => {
      jest.spyOn(prisma.location, 'findMany').mockRejectedValue(new Error('Async error'));
      await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
    });
  });

describe('createLocation', () => {
    it('should successfully create a location', async () => {
        jest.spyOn(prisma.location, 'create').mockResolvedValue(result[0]);
        await expect(service.createLocation(result[0])).resolves.toEqual(result[0]);
    });

    it('should throw an error if the location cannot be created', async () => {
        jest.spyOn(prisma.location, 'create').mockRejectedValue(new Error('Async error'));
        await expect(service.createLocation({} as CreateLocationDto)).rejects.toThrow(InternalServerErrorException);
    });
});

  describe('findOne', () => {
    it('should return a single location by id', async () => {
      const location = { id: '1', name: 'Test Location', description: 'Test', lat: 0, lng: 0 };
      jest.spyOn(prisma.location, 'findUnique').mockResolvedValue(result[0]);
      await expect(service.findOne('1')).resolves.toEqual(result[0]);
    });

    it('should throw a NotFoundException if the location is not found', async () => {
      jest.spyOn(prisma.location, 'findUnique').mockResolvedValue(null);
      await expect(service.findOne('unknown')).rejects.toThrow(NotFoundException);
    });
  });
});

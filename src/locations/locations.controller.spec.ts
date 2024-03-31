import { Test, TestingModule } from '@nestjs/testing';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { Location } from '../models/location.models';

describe('LocationsController', () => {
  let controller: LocationsController;
  let service: LocationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationsController],
      providers: [
        {
          provide: LocationsService,
          useValue: {
            findAll: jest.fn(),
            createLocation: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LocationsController>(LocationsController);
    service = module.get<LocationsService>(LocationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

   const result: Location[] = [
      { id: '1', name: 'Location 1', latitude: 0, longitude: 0, created_at: new Date()},
      { id: '2', name: 'Location 2', latitude: 1, longitude: 1, created_at: new Date() },
    ];
    const createLocationDto: CreateLocationDto = { name: 'New Location', latitude: 0, longitude: 0, };

  describe('findAll', () => {
   
    it('should return an array of locations', async () => {
      
      jest.spyOn(service, 'findAll').mockImplementation(async () => result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('createLocation', () => {
    it('should create a location', async () => {
      jest.spyOn(service, 'createLocation').mockImplementation(async () => result[0]);

      expect(await controller.createEpisode(createLocationDto)).toBe(result[0]);
    });
  });
});

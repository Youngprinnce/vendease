import { Test, TestingModule } from "@nestjs/testing";
import { CharactersController } from "./characters.controller";
import { CharactersService } from "./characters.service";
import { Character } from '../models/character.models';
import { CreateCharacterDto } from "./dto/create-character.dto";
import { AssignEpisodesDto } from "./dto/assign-episodes.dto";
import { CharacterSortByEnum, CharacterSortOrderEnum } from "../common/util";
import { Gender } from "@prisma/client";
import { NotFoundException } from "@nestjs/common";

describe("CharactersController", () => {
  let controller: CharactersController;
  let service: CharactersService;

  beforeEach(async () => {
    const mockCharactersService = {
      findAll: jest.fn(),
      createCharacter: jest.fn(),
      assignEpisodes: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharactersController],
      providers: [{ provide: CharactersService, useValue: mockCharactersService }],
    }).compile();

    controller = module.get<CharactersController>(CharactersController);
    service = module.get<CharactersService>(CharactersService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
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

  const mockCreateCharacterDto: CreateCharacterDto = {
    first_name: "John",
    last_name: "Doe",
    state_of_origin: "Lagos",
    gender: Gender.MALE,
    status: "ACTIVE",
    locationId: "1",
  };

  describe("findAll", () => {
    it("should return an array of characters", async () => {
      jest.spyOn(service, "findAll").mockResolvedValue([mockCharacter]);

      const result = await controller.findAll(
        CharacterSortByEnum.NAME,
        CharacterSortOrderEnum.ASC,
        Gender.MALE,
        "new york"
      );

      expect(result).toEqual([mockCharacter]);
    });
  });

  describe("createCharacter", () => {
    it("should create a character", async () => {
      jest.spyOn(service, "createCharacter").mockResolvedValue(mockCharacter);

      const result = await controller.createCharacter(mockCreateCharacterDto);

      expect(result).toEqual(mockCharacter);
    });
  });

  describe("linkCharacters", () => {
    it("should link episodes to a character", async () => {
      const assignEpisodesDto: AssignEpisodesDto = { episodeIds: ["1"] };
      jest.spyOn(service, "assignEpisodes").mockResolvedValue(undefined);

      const result = await controller.linkCharacters("1", assignEpisodesDto);

      expect(result).toBeUndefined();
    });

    it("should throw NotFoundException if character not found", async () => {
      const assignEpisodesDto: AssignEpisodesDto = { episodeIds: ["1"] };
      jest.spyOn(service, "assignEpisodes").mockRejectedValue(new NotFoundException());

      await expect(controller.linkCharacters("1", assignEpisodesDto)).rejects.toThrowError(NotFoundException);
    });
  });
});

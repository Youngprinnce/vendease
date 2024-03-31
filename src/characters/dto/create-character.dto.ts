import { OmitType } from "@nestjs/swagger";
import { Character } from "../../models/character.models";

export class CreateCharacterDto extends OmitType(Character, ['id', 'created_at', 'episodes', 'location']) {}

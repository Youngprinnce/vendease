import { OmitType } from "@nestjs/swagger";
import { Location } from "../../models/location.models";

export class CreateLocationDto extends OmitType(Location, ['id', 'created_at', 'character']) {}

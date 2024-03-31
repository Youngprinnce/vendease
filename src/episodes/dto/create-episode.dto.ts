import { OmitType } from "@nestjs/swagger";
import { Episode } from "../../models/episodes.models";

export class CreateEpisodeDto extends OmitType(Episode, ['id', 'created_at', 'characters', 'episode_comments']) {}

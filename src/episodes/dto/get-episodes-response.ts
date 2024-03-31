import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Episode } from "../../models/episodes.models";

export class EpisodeCommentCount {
    @ApiProperty({type: Number, description: 'Number of comments on the episode'})
    episode_comments: number;
}

export class GetEpisodesDto extends OmitType(Episode, ['episode_comments']) {
    @ApiProperty({type: () => EpisodeCommentCount, description: 'Counts related to the episode'})
    _count: EpisodeCommentCount;
}

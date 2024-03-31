import { Module } from '@nestjs/common';
import { EpisodesService } from './episodes.service';
import { EpisodesController } from './episodes.controller';
import { CommentModule } from '../comments/comments.module';

@Module({
  imports: [CommentModule],
  providers: [EpisodesService],
  controllers: [EpisodesController],
})
export class EpisodeModule {}

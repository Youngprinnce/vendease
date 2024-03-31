import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { EpisodeModule } from './episodes/episodes.module';
import { CommentModule } from './comments/comments.module';
import { CharacterModule } from './characters/characters.module';
import { LocationModule } from './locations/locations.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, EpisodeModule, CharacterModule, CommentModule, LocationModule],
})
export class AppModule {}

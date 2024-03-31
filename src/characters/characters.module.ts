import { Module } from '@nestjs/common';
import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';
import { LocationModule } from 'src/locations/locations.module';

@Module({
  imports: [LocationModule],
  providers: [CharactersService],
  controllers: [CharactersController],
})
export class CharacterModule {}

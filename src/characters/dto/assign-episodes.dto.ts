import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignEpisodesDto {
  @IsNotEmpty()
  @Type(() => UUIDValidator)
  @ApiProperty({ type: String, isArray: true })
  episodeIds: string[];
}

export class UUIDValidator {
  @IsUUID(undefined, { each: true })
  id: string;
}


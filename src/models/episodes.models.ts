import { Type } from 'class-transformer';
import { Character } from './character.models';
import { Comment } from '../models/comment.models';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDate, ValidateNested, IsNotEmpty, IsUUID } from 'class-validator';

export class Episode {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({type: String, description: 'Name of the episode' })
  name: string;

  @IsNotEmpty()
  @IsDate()
  @ApiProperty({type: Date, description: 'Release date of the episode' })
  release_date: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({type: String, description: 'Code of the episode' })
  episode_code: string;

  @ValidateNested({ each: true })
  @Type(() => Comment)
  @ApiPropertyOptional({ type: () => Comment, isArray: true })
  episode_comments?: Comment[];

  @ValidateNested({ each: true })
  @Type(() => Character)
  @ApiPropertyOptional({ type: () => Character, isArray: true })
  characters?: Character[];

  @IsNotEmpty()
  @IsDate()
  @ApiProperty({type: Date, description: 'Date' })
  created_at: Date;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({type: String, description: 'ID of the episode' })
  id: string;
}

import { Type } from 'class-transformer';
import { Location } from './location.models';
import { Episode } from '../models/episodes.models';
import { CharacterStatus, Gender } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, ValidateNested, IsDate, IsUUID } from 'class-validator';

export class Character {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({type: String, description: 'First name of the character' })
  first_name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({type: String, description: 'Last name of the character' })
  last_name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({type: String, description: 'State of origin of the character' })
  state_of_origin: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  @ApiProperty({ enum: Gender, enumName: 'Gender' })
  gender: Gender;

  @IsNotEmpty()
  @IsEnum(CharacterStatus)
  @ApiProperty({ enum: CharacterStatus, enumName: 'CharacterStatus' })
  status: CharacterStatus;

  @ValidateNested()
  @Type(() => Location)
  @ApiPropertyOptional({ type: () => Location })
  location?: Location;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({type: String, description: 'locationId' })
  locationId: string;

  @Type(() => Episode)
  @ValidateNested({ each: true })
  @ApiPropertyOptional({ type: () => Episode, isArray: true })
  episodes?: Episode[];

  @IsNotEmpty()
  @IsDate()
  @ApiProperty({type: Date, description: 'Date' })
  created_at: Date;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({type: String, description: 'ID of the character' })
  id: string;
}


import { Type } from 'class-transformer';
import { Character } from './character.models';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsLongitude, IsLatitude, IsDate, IsUUID, ValidateNested } from 'class-validator';

export class Location {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({type: String, description: 'Name of the location' })
  name: string;

  @IsNotEmpty()
  @IsLatitude()
  @ApiProperty({type: Number, description: 'Latitude of the location' })
  latitude: number;

  @IsNotEmpty()
  @IsLongitude()
  @ApiProperty({type: Number, description: 'Longitude of the location' })
  longitude: number;

  @IsNotEmpty()
  @IsDate()
  @ApiProperty({type: Date, description: 'Date of creation of the location' })
  created_at: Date;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({type: String, description: 'ID of the location' })
  id: string;

  @ValidateNested({ each: true })
  @Type(() => Character)
  @ApiPropertyOptional({ type: () => Character })
  character?: Character;
}

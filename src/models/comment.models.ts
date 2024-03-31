import { Type } from 'class-transformer';
import { Episode } from './episodes.models';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsIP, IsDate, IsUUID, ValidateNested } from 'class-validator';

export class Comment {
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  @ApiProperty({type: String, description: 'Comment' })
  comment: string;

  @IsNotEmpty()
  @IsIP()
  @ApiProperty({type: String, description: 'IP address location' })
  ip_address_location: string;

  @IsNotEmpty()
  @IsDate()
  @ApiProperty({type: Date, description: 'Date' })
  created_at: Date;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({type: String, description: 'ID of the comment' })
  id: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({type: String, description: 'ID of the episode' })
  episodeId: string;

  @Type(() => Episode)
  @ValidateNested({ each: true })
  @ApiPropertyOptional({ type: () => Episode})
  episode?: Episode;
}

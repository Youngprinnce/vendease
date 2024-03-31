import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignCharactersDto {
  @IsNotEmpty()
  @Type(() => UUIDValidator)
  @ApiProperty({ type: String, isArray: true })
  characterIds: string[];
}

export class UUIDValidator {
  @IsUUID(undefined, { each: true })
  id: string;
}

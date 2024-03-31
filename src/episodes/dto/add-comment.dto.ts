import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Comment } from '../../models/comment.models';

export class AddCommentDto extends OmitType(Comment, ['id', 'created_at', 'episode']) {}

export class CreateCommentDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(250)
    @ApiProperty({type: String, description: 'Comment' })
    comment: string;
}

import { CommentsService } from "./comments.service";
import { Comment } from "../models/comment.models";
import { ApiResponse, ApiTags, OmitType } from "@nestjs/swagger";
import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";

@ApiTags('Comments')
@Controller("comments")
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all comments',
    type: () => OmitType(Comment, ['id', 'episode', 'episodeId'] as const),
  })
  findAll() {
    return this.commentsService.findAll();
  }
}

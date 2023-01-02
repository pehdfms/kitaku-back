import { PaginationQuery } from '@libs/types/pagination'
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ThreadService } from './thread.service'
import { CreateThreadDto } from './dtos/create-thread.dto'
import { UpdateThreadDto } from './dtos/update-thread.dto'

@ApiTags('Threads')
@Controller('boards/:board/threads')
export class ThreadController {
  private readonly logger = new Logger(ThreadController.name)

  constructor(private readonly threadService: ThreadService) {}

  @Post()
  async create(@Param('board') board: string, @Body() createThreadDto: CreateThreadDto) {
    return await this.threadService.create(board, createThreadDto)
  }

  @Get()
  async findAll(@Param('board') board: string, @Query() query: PaginationQuery) {
    return await this.threadService.findAll(board, query)
  }

  @Get(':postId')
  async findOne(@Param('board') board: string, @Param('postId', ParseIntPipe) postId: number) {
    return await this.threadService.findOne(board, postId)
  }

  @Patch(':postId')
  async update(
    @Param('board') board: string,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() updateThreadDto: UpdateThreadDto
  ) {
    return await this.threadService.update(board, postId, updateThreadDto)
  }

  @Delete(':postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('board') board: string, @Param('postId', ParseIntPipe) postId: number) {
    await this.threadService.remove(board, postId)
  }
}

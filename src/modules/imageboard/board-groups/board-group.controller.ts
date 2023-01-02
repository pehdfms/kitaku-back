import { PaginationQuery } from '@libs/types/pagination'
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Logger,
  Query,
  HttpCode,
  HttpStatus
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { BoardGroupService } from './board-group.service'
import { CreateBoardGroupDto } from './dtos/create-board-group.dto'
import { UpdateBoardGroupDto } from './dtos/update-board-group.dto'

@ApiTags('Board Groups')
@Controller('board-groups')
export class BoardGroupController {
  private readonly logger = new Logger(BoardGroupController.name)

  constructor(private readonly boardGroupService: BoardGroupService) {}

  @Post()
  async create(@Body() createBoardGroupDto: CreateBoardGroupDto) {
    return await this.boardGroupService.create(createBoardGroupDto)
  }

  @Get()
  async findAll(@Query() query: PaginationQuery) {
    return await this.boardGroupService.findAll(query)
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.boardGroupService.findOne(id)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBoardGroupDto: UpdateBoardGroupDto
  ) {
    return await this.boardGroupService.update(id, updateBoardGroupDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.boardGroupService.remove(id)
  }
}

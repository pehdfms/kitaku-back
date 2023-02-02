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
  HttpStatus
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { BoardService } from './board.service'
import { CreateBoardDto } from './dtos/create-board.dto'
import { UpdateBoardDto } from './dtos/update-board.dto'

@ApiTags('Boards')
@Controller('boards')
export class BoardController {
  private readonly logger = new Logger(BoardController.name)

  constructor(private readonly boardService: BoardService) {}

  @Post()
  async create(@Body() createBoardDto: CreateBoardDto) {
    return await this.boardService.create(createBoardDto)
  }

  @Get()
  async findAll(@Query() query: PaginationQuery) {
    return await this.boardService.findAll(query)
  }

  @Get(':identifier')
  async findOne(@Param('identifier') identifier: string) {
    return await this.boardService.findOne(identifier)
  }

  @Get(':identifier/catalog')
  async getCatalog(@Param('identifier') identifier: string) {
    return await this.boardService.getCatalog(identifier)
  }

  @Patch(':identifier')
  async update(@Param('identifier') identifier: string, @Body() updateBoardDto: UpdateBoardDto) {
    return await this.boardService.update(identifier, updateBoardDto)
  }

  @Delete(':identifier')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('identifier') identifier: string) {
    await this.boardService.remove(identifier)
  }
}

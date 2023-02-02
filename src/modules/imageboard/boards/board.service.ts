import { EntityRepository, wrap } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PaginationQuery, PaginationResponse } from 'src/libs/types/pagination'
import { getPaginationOptions } from 'src/libs/utils/pagination.utils'
import { Thread } from '../posts/thread.entity'
import { Board } from './board.entity'
import { CreateBoardDto } from './dtos/create-board.dto'
import { UpdateBoardDto } from './dtos/update-board.dto'

@Injectable()
export class BoardService {
  private readonly logger = new Logger(BoardService.name)

  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: EntityRepository<Board>
  ) {}

  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    const newBoard = this.boardRepository.create(createBoardDto)
    await this.boardRepository.persistAndFlush(newBoard)

    return newBoard
  }

  async findAll(query: PaginationQuery): Promise<PaginationResponse<Board>> {
    const [result, total] = await this.boardRepository.findAndCount(
      {},
      { ...getPaginationOptions(query) }
    )

    return new PaginationResponse(query, total, result)
  }

  async findOne(identifier: string): Promise<Board> {
    const result = await this.boardRepository.findOne({ identifier })

    if (!result) {
      throw new NotFoundException()
    }

    return result
  }

  async getCatalog(identifier: string): Promise<Thread[]> {
    const result = await this.boardRepository.findOne({ identifier }, { populate: ['threads'] })

    if (!result) {
      throw new NotFoundException()
    }

    return result.catalog.getItems()
  }

  async update(identifier: string, updateBoardDto: UpdateBoardDto): Promise<Board> {
    const existingBoard = await this.findOne(identifier)
    wrap(existingBoard).assign(updateBoardDto)

    await this.boardRepository.persistAndFlush(existingBoard)
    return existingBoard
  }

  async remove(identifier: string): Promise<void> {
    const board = await this.findOne(identifier)
    await this.boardRepository.removeAndFlush(board)
  }

  async incrementPostCount(identifier: string): Promise<number> {
    const board = await this.findOne(identifier)
    const newPostCount = board.postCount + 1
    wrap(board).assign({ postCount: newPostCount })

    await this.boardRepository.persistAndFlush(board)
    return newPostCount
  }
}

import { EntityRepository, wrap } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PaginationQuery, PaginationResponse } from 'src/libs/types/pagination'
import { getPaginationOptions } from 'src/libs/utils/pagination.utils'
import { BoardGroup } from './board-group.entity'
import { CreateBoardGroupDto } from './dtos/create-board-group.dto'
import { UpdateBoardGroupDto } from './dtos/update-board-group.dto'

@Injectable()
export class BoardGroupService {
  private readonly logger = new Logger(BoardGroupService.name)

  constructor(
    @InjectRepository(BoardGroup)
    private readonly boardGroupRepository: EntityRepository<BoardGroup>
  ) {}

  async create(createBoardGroupDto: CreateBoardGroupDto): Promise<BoardGroup> {
    const newBoardGroup = this.boardGroupRepository.create(createBoardGroupDto)
    await this.boardGroupRepository.persistAndFlush(newBoardGroup)

    return newBoardGroup
  }

  async findAll(query: PaginationQuery): Promise<PaginationResponse<BoardGroup>> {
    const [result, total] = await this.boardGroupRepository.findAndCount(
      {},
      { ...getPaginationOptions(query), populate: ['boards'] }
    )

    return new PaginationResponse(query, total, result)
  }

  async findOne(id: string): Promise<BoardGroup> {
    const result = await this.boardGroupRepository.findOne(id, { populate: ['boards'] })

    if (!result) {
      throw new NotFoundException()
    }

    return result
  }

  async update(id: string, updateBoardGroupDto: UpdateBoardGroupDto): Promise<BoardGroup> {
    const existingBoardGroup = await this.findOne(id)
    wrap(existingBoardGroup).assign(updateBoardGroupDto)

    await this.boardGroupRepository.persistAndFlush(existingBoardGroup)
    return existingBoardGroup
  }

  async remove(id: string): Promise<void> {
    const boardGroup = await this.findOne(id)
    await this.boardGroupRepository.removeAndFlush(boardGroup)
  }
}

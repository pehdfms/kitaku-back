import { EntityRepository, wrap } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PaginationQuery, PaginationResponse } from 'src/libs/types/pagination'
import { getPaginationOptions } from 'src/libs/utils/pagination.utils'
import { Thread } from './thread.entity'
import { CreateThreadDto } from './dtos/create-thread.dto'
import { UpdateThreadDto } from './dtos/update-thread.dto'
import { BoardService } from '../boards/board.service'

@Injectable()
export class ThreadService {
  private readonly logger = new Logger(ThreadService.name)

  constructor(
    @InjectRepository(Thread)
    private readonly threadRepository: EntityRepository<Thread>,
    private readonly boardService: BoardService
  ) {}

  async create(board: string, createThreadDto: CreateThreadDto): Promise<Thread> {
    // FIXME this most likely suffers from a nasty concurrency bug where if two
    // posts occur at the same time we can end up issuing duplicate postIds,
    // causing one of them to fail while still incrementing the counter
    const foundBoard = await this.boardService.findOne(board)
    const postCount = await this.boardService.incrementPostCount(board)

    const newThread = this.threadRepository.create({
      ...createThreadDto,
      board: foundBoard,
      postId: postCount
    })

    await this.threadRepository.persistAndFlush(newThread)

    return newThread
  }

  async findAll(board: string, query: PaginationQuery): Promise<PaginationResponse<Thread>> {
    const [result, total] = await this.threadRepository.findAndCount(
      { board: { identifier: board } },
      getPaginationOptions(query)
    )

    return new PaginationResponse(query, total, result)
  }

  async findOne(board: string, threadId: number): Promise<Thread> {
    const result = await this.threadRepository.findOne([board, threadId])

    if (!result) {
      throw new NotFoundException()
    }

    return result
  }

  async update(board: string, threadId: number, updateThreadDto: UpdateThreadDto): Promise<Thread> {
    const existingThread = await this.findOne(board, threadId)
    wrap(existingThread).assign(updateThreadDto)

    await this.threadRepository.persistAndFlush(existingThread)
    return existingThread
  }

  async remove(board: string, threadId: number): Promise<void> {
    const thread = await this.findOne(board, threadId)
    await this.threadRepository.removeAndFlush(thread)
  }
}

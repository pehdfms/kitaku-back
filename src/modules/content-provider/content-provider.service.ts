import { EntityRepository, MikroORM, UseRequestContext } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  StreamableFile
} from '@nestjs/common'
import { MediaContent } from './entities/media-content.entity'
import { join } from 'path'
import { ConfigService } from '@nestjs/config'
import { Cron, CronExpression } from '@nestjs/schedule'
import { createReadStream, unlinkSync } from 'fs'
import { CreateMediaContentDto } from './dto/create-media-content.dto'
import { Response } from 'express'
import { InfoDto } from './dto/info.dto'
import { getFileSize } from './utils'
import { isOlderThan, oneDay } from '@libs/utils/time.utils'

@Injectable()
export class ContentProviderService {
  private readonly logger = new Logger(ContentProviderService.name)

  constructor(
    @InjectRepository(MediaContent)
    private readonly mediaContentRepository: EntityRepository<MediaContent>,
    private readonly configService: ConfigService,
    private readonly orm: MikroORM
  ) {}

  async uploadFile(createMediaContentDto: CreateMediaContentDto) {
    const newMediaContent = this.mediaContentRepository.create(createMediaContentDto)
    await this.mediaContentRepository.persistAndFlush(newMediaContent)

    return newMediaContent
  }

  async info(): Promise<InfoDto> {
    const total = await this.mediaContentRepository.count()
    const linkedFiles = total - (await this.findUnlinkedFiles()).length
    const usedSpace = this.getUsedSpace()

    return { total, linkedFiles, usedSpace }
  }

  async findUnlinkedFiles(): Promise<MediaContent[]> {
    return await this.mediaContentRepository.findAll({ having: { isLinked: false }, groupBy: 'id' })
  }

  getUsedSpace(): string {
    try {
      const fileStorageDirectory = join(process.cwd(), this.configService.get('FILE_STORAGE_PATH'))
      const usedSpace = getFileSize(fileStorageDirectory)
      return usedSpace
    } catch (e) {
      this.logger.error(e)
      return 'Unable to get used space'
    }
  }

  async downloadFile(uuid: string, response: Response) {
    const result = await this.mediaContentRepository.findOne(uuid)

    if (!result) {
      response.status(HttpStatus.NOT_FOUND)
      throw new NotFoundException()
    }

    const file = createReadStream(join(process.cwd(), result.path))

    response.set({
      'Content-Disposition': `inline; filename="${result.filename}"`,
      'Content-Type': result.mimetype
    })

    return new StreamableFile(file)
  }

  async deleteFile(uuid: string) {
    const mediaContent = await this.mediaContentRepository.findOne(uuid)

    if (!mediaContent) {
      throw new NotFoundException()
    }

    const path = join(process.cwd(), mediaContent.path)

    try {
      unlinkSync(path)
      await this.mediaContentRepository.removeAndFlush(mediaContent)
    } catch (e) {
      this.logger.error(e)
      throw new InternalServerErrorException()
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  @UseRequestContext()
  async cleanUnlinkedFiles(): Promise<void> {
    const unlinkedFiles = await this.findUnlinkedFiles()
    const oldUnlinkedFiles = unlinkedFiles.filter((file) => isOlderThan(file.created, oneDay))

    oldUnlinkedFiles.forEach((unlinkedFile) => {
      this.deleteFile(unlinkedFile.id)
    })

    this.logger.log(`Succesfully cleaned ${oldUnlinkedFiles.length} unlinked files`)
  }
}

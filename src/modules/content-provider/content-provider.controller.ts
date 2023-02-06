import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Res,
  ParseFilePipeBuilder,
  Logger
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiPayloadTooLargeResponse,
  ApiTags,
  ApiUnsupportedMediaTypeResponse
} from '@nestjs/swagger'
import { randomUUID } from 'crypto'
import { Response } from 'express'
import { writeFile } from 'fs'
import { join } from 'path'
import sharp from 'sharp'
import { promisify } from 'util'
import { ContentProviderService } from './content-provider.service'
import { FileUploadDto } from './dto/file-upload.dto'
import { InfoDto } from './dto/info.dto'
import { MediaContentFileInterceptor } from './interceptors/media-content-file.interceptor'

@ApiTags('Content Provider')
@Controller('content-provider')
export class ContentProviderController {
  private readonly logger = new Logger(ContentProviderService.name)

  constructor(
    private readonly contentProviderService: ContentProviderService,
    private readonly configService: ConfigService
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'The file to upload', type: FileUploadDto })
  @ApiCreatedResponse({
    description:
      "File uploaded succesfully, this file must be linked to an entity within 24 hours otherwise it'll be deleted"
  })
  @ApiPayloadTooLargeResponse({ description: 'File is too large to be uploaded' })
  @ApiUnsupportedMediaTypeResponse({ description: 'File extension is not allowed' })
  @UseInterceptors(MediaContentFileInterceptor({ fieldName: 'file' }))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /jpg|jpeg|png|gif|webm/ })
        .build({ errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE })
    )
    file: Express.Multer.File
  ) {
    const filename = randomUUID() + '.' + file.originalname.split('.')[1]
    const fileDestination = this.configService.get('FILE_STORAGE_PATH')
    const filePath = join(fileDestination, filename)

    const buffer = await sharp(file.buffer).toBuffer()
    await promisify(writeFile)(filePath, buffer)

    return await this.contentProviderService.uploadFile({
      path: filePath,
      filename: file.originalname,
      mimetype: file.mimetype
    })
  }

  @Get()
  @ApiOkResponse({ description: 'Returns info about the stored files', type: InfoDto })
  async info(): Promise<InfoDto> {
    return await this.contentProviderService.info()
  }

  @Get(':uuid')
  @ApiOkResponse({ description: 'Found file from uuid, returns the file' })
  @ApiNotFoundResponse({ description: 'Could not find file from uuid' })
  async downloadFile(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Res({ passthrough: true }) response: Response
  ) {
    return await this.contentProviderService.downloadFile(uuid, response)
  }

  @Delete(':uuid')
  @ApiNoContentResponse({ description: 'Deleted file succesfully' })
  @ApiNotFoundResponse({ description: 'Could not find file' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFile(@Param('uuid', ParseUUIDPipe) uuid: string) {
    await this.contentProviderService.deleteFile(uuid)
  }
}

import { FileInterceptor } from '@nestjs/platform-express'
import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
import { memoryStorage } from 'multer'
import { megaByte } from '../constants/size'

interface MediaContentFileInterceptorOptions {
  fieldName: string
}

export function MediaContentFileInterceptor(
  options: MediaContentFileInterceptorOptions
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor
    constructor() {
      const multerOptions: MulterOptions = {
        storage: memoryStorage(),
        limits: {
          fileSize: 10 * megaByte
        }
      }

      this.fileInterceptor = new (FileInterceptor(options.fieldName, multerOptions))()
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args)
    }
  }
  return mixin(Interceptor)
}

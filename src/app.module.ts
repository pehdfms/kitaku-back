import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { LoggerModule } from 'nestjs-pino'
import Joi from 'joi'
import { ImageboardModule } from '@modules/imageboard/imageboard.module'
import { ContentProviderModule } from '@modules/content-provider/content-provider.module'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  controllers: [],
  providers: [],
  imports: [
    ScheduleModule.forRoot(),
    MikroOrmModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            colorize: true
          }
        }
      }
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        PORT: Joi.number().required(),
        HOST: Joi.string().required(),
        MODE: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.number().required(),
        FILE_STORAGE_PATH: Joi.string().required()
      })
    }),
    ImageboardModule,
    ContentProviderModule
  ]
})
export class AppModule {}

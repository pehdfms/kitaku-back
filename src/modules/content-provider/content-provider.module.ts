import { Module } from '@nestjs/common'
import { ContentProviderService } from './content-provider.service'
import { ContentProviderController } from './content-provider.controller'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { MediaContent } from './entities/media-content.entity'

@Module({
  imports: [MikroOrmModule.forFeature([MediaContent])],
  controllers: [ContentProviderController],
  providers: [ContentProviderService],
  exports: [ContentProviderService]
})
export class ContentProviderModule {}

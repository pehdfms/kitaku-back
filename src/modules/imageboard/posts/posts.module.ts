import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { BoardsModule } from '../boards/boards.module'
import { ThreadController } from './thread.controller'
import { Thread } from './thread.entity'
import { ThreadService } from './thread.service'

@Module({
  imports: [MikroOrmModule.forFeature([Thread]), BoardsModule],
  controllers: [ThreadController],
  providers: [ThreadService],
  exports: [ThreadService]
})
export class PostsModule {}

import { Module } from '@nestjs/common'
import { BoardsModule } from './boards/boards.module'
import { BoardGroupsModule } from './board-groups/board-groups.module'
import { PostsModule } from './posts/posts.module'

@Module({
  imports: [BoardsModule, BoardGroupsModule, PostsModule]
})
export class ImageboardModule {}

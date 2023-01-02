import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { BoardGroupController } from './board-group.controller'
import { BoardGroup } from './board-group.entity'
import { BoardGroupService } from './board-group.service'

@Module({
  imports: [MikroOrmModule.forFeature([BoardGroup])],
  controllers: [BoardGroupController],
  providers: [BoardGroupService],
  exports: [BoardGroupService]
})
export class BoardGroupsModule {}

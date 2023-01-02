import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { BoardController } from './board.controller'
import { Board } from './board.entity'
import { BoardService } from './board.service'

@Module({
  imports: [MikroOrmModule.forFeature([Board])],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService]
})
export class BoardsModule {}

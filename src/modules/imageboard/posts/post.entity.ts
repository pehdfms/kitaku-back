import { AuditedEntity } from '@libs/types/entity'
import {
  Entity,
  ManyToOne,
  PrimaryKey,
  PrimaryKeyType,
  Property,
  Ref,
  Unique
} from '@mikro-orm/core'
import { OmitType } from '@nestjs/swagger'
import { Board } from '../boards/board.entity'

@Entity({
  discriminatorColumn: 'type',
  discriminatorMap: { thread: 'Thread', reply: 'Reply' },
  abstract: true
})
@Unique({ properties: ['postId', 'board'] })
export abstract class Post extends OmitType(AuditedEntity, ['id']) {
  @ManyToOne(() => Board, { ref: true, primary: true })
  board: Ref<Board>

  @PrimaryKey()
  postId: number;

  [PrimaryKeyType]?: [string, number]

  @Property({ length: 2 ** 14 })
  content: string
}

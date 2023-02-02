import { AuditedEntity } from '@libs/types/entity'
import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  PrimaryKeyType,
  Property,
  Ref,
  Unique
} from '@mikro-orm/core'
import { MediaContent } from '@modules/content-provider/entities/media-content.entity'
import { OmitType } from '@nestjs/swagger'
import { Board } from '../boards/board.entity'

@Entity({
  discriminatorColumn: 'type',
  discriminatorMap: { thread: 'Thread', reply: 'Reply' },
  abstract: true
})
@Unique({ properties: ['postId', 'board'] })
export abstract class Post extends OmitType(AuditedEntity, ['id']) {
  @ManyToOne(() => Board, { serializer: (board) => board.identifier, ref: true, primary: true })
  board: Ref<Board>

  @PrimaryKey()
  postId: number

  @OneToOne(() => MediaContent, (mediaContent) => mediaContent.post, {
    nullable: true,
    ref: true,
    mappedBy: 'post'
  })
  media?: Ref<MediaContent>

  @Property({ length: 2 ** 13 })
  content: string;

  [PrimaryKeyType]?: [string, number]
}

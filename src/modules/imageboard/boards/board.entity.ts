import { AuditedEntity } from '@libs/types/entity'
import {
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Ref,
  Unique
} from '@mikro-orm/core'
import { OmitType } from '@nestjs/swagger'
import { BoardGroup } from '../board-groups/board-group.entity'
import { Post } from '../posts/post.entity'

@Entity()
export class Board extends OmitType(AuditedEntity, ['id']) {
  @ManyToOne(() => BoardGroup, { ref: true })
  boardGroup: Ref<BoardGroup>

  @PrimaryKey()
  identifier: string

  @Property()
  @Unique()
  name: string

  @Property({ default: 0 })
  postCount: number

  @OneToMany({
    entity: () => Post,
    mappedBy: 'board',
    cascade: [Cascade.ALL]
  })
  posts = new Collection<Post>(this)
}

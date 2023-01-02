import { AuditedEntity } from '@libs/types/entity'
import { Collection, Entity, OneToMany, Property, Unique } from '@mikro-orm/core'
import { Board } from '../boards/board.entity'

@Entity()
export class BoardGroup extends AuditedEntity {
  @Property()
  @Unique()
  name: string

  @OneToMany({
    entity: () => Board,
    mappedBy: 'boardGroup'
  })
  boards = new Collection<Board>(this)
}

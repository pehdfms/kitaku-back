import { AuditedEntity } from '@libs/types/entity'
import { Cascade, Entity, OneToMany, Property } from '@mikro-orm/core'
import { Deck } from '@modules/spaced-repetition/decks/deck.entity'

@Entity()
export class User extends AuditedEntity {
  @Property()
  nickname: string

  @Property({ unique: true })
  email: string

  @Property()
  isAdmin: boolean

  @Property({ hidden: true })
  password: string

  @OneToMany({
    entity: () => Deck,
    mappedBy: (deck) => deck.owner,
    cascade: [Cascade.ALL]
  })
  decks: Deck
}

import { AuditedEntity } from '@libs/types/entity'
import { Cascade, Collection, Entity, Enum, ManyToOne, OneToMany, Property } from '@mikro-orm/core'
import { User } from '@modules/identity/users/user.entity'
import { FlashCard } from '../flash-cards/flash-card.entity'
import { AvailableSchedulers, SchedulerFactory } from '../schedulers/scheduler.factory'
import { SchedulingStrategy } from '../schedulers/scheduling.strategy'

@Entity()
export class Deck extends AuditedEntity {
  @Property()
  name: string

  @ManyToOne(() => User)
  owner: User

  @Property()
  description: string

  @Enum(() => AvailableSchedulers)
  scheduler: AvailableSchedulers

  @OneToMany({
    entity: () => FlashCard,
    mappedBy: (flashcard) => flashcard.deck,
    cascade: [Cascade.ALL]
  })
  flashCards = new Collection<FlashCard>(this)

  getScheduler(): SchedulingStrategy {
    return new SchedulerFactory().fromEnum(this.scheduler)
  }
}

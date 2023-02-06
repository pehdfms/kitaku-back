import { Cascade, Collection, Entity, OneToMany, Property } from '@mikro-orm/core'
import { Post } from './post.entity'
import { Reply } from './reply.entity'

@Entity()
export class Thread extends Post {
  @Property({ nullable: true })
  title?: string

  @OneToMany({ entity: () => Reply, mappedBy: 'thread', cascade: [Cascade.ALL] })
  replies = new Collection<Reply>(this)

  @Property({ persist: false })
  get info() {
    return this.replies.isInitialized()
      ? {
          postCount: 1 + this.replies.count(),
          userCount: 1,
          mediaCount: 1 + this.replies.getItems().filter((reply) => reply.media).length
        }
      : {
          postCount: 1,
          userCount: 1,
          mediaCount: 1
        }
  }

  bump() {
    return
  }
}

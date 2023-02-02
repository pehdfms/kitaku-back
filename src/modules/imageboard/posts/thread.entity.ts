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
    return {
      postCount: Math.floor(Math.random() * 500),
      userCount: Math.floor(Math.random() * 500),
      mediaCount: Math.floor(Math.random() * 500)
    }
  }

  bump() {
    return
  }
}

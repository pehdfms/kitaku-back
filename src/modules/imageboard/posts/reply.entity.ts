import { Entity, ManyToOne, Ref } from '@mikro-orm/core'
import { Post } from './post.entity'
import { Thread } from './thread.entity'

@Entity()
export class Reply extends Post {
  @ManyToOne(() => Thread, { ref: true })
  thread: Ref<Thread>
}

import { AuditedEntity } from '@libs/types/entity'
import { apiUrl } from '@main'
import { Entity, Formula, OneToOne, Property, Ref } from '@mikro-orm/core'
import type { Post } from '@modules/imageboard/posts/post.entity'

@Entity()
export class MediaContent extends AuditedEntity {
  @Property()
  filename: string

  @Property()
  mimetype: string

  @Property()
  path: string

  @OneToOne(() => 'Post', (post: Post) => post.media, {
    owner: true,
    nullable: true,
    ref: true
  })
  post?: Ref<Post>

  @Formula('false')
  isLinked: boolean

  @Property({ persist: false })
  get url() {
    return apiUrl + `/api/content-provider/${this.id}`
  }
}

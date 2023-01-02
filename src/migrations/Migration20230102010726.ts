import { Migration } from '@mikro-orm/migrations';

export class Migration20230102010726 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop table if exists "post_mentions" cascade;');

    this.addSql('alter table "post" add column "thread_board_identifier" varchar(255) null, add column "thread_post_id" int null;');
    this.addSql('alter table "post" alter column "media" type varchar(255) using ("media"::varchar(255));');
    this.addSql('alter table "post" alter column "media" drop not null;');
    this.addSql('alter table "post" add constraint "post_thread_board_identifier_thread_post_id_foreign" foreign key ("thread_board_identifier", "thread_post_id") references "post" ("board_identifier", "post_id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('create table "post_mentions" ("post_1_board_identifier" varchar(255) not null, "post_1_post_id" int not null, "post_2_board_identifier" varchar(255) not null, "post_2_post_id" int not null, constraint "post_mentions_pkey" primary key ("post_1_board_identifier", "post_1_post_id", "post_2_board_identifier", "post_2_post_id"));');

    this.addSql('alter table "post_mentions" add constraint "post_mentions_post_1_board_identifier_post_1_post_id_foreign" foreign key ("post_1_board_identifier", "post_1_post_id") references "post" ("board_identifier", "post_id") on update cascade on delete cascade;');
    this.addSql('alter table "post_mentions" add constraint "post_mentions_post_2_board_identifier_post_2_post_id_foreign" foreign key ("post_2_board_identifier", "post_2_post_id") references "post" ("board_identifier", "post_id") on update cascade on delete cascade;');

    this.addSql('alter table "post" drop constraint "post_thread_board_identifier_thread_post_id_foreign";');

    this.addSql('alter table "post" alter column "media" type varchar(255) using ("media"::varchar(255));');
    this.addSql('alter table "post" alter column "media" set not null;');
    this.addSql('alter table "post" drop column "thread_board_identifier";');
    this.addSql('alter table "post" drop column "thread_post_id";');
  }

}

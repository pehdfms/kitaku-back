import { Migration } from '@mikro-orm/migrations';

export class Migration20230102005541 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "board_group" ("id" varchar(255) not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "name" varchar(255) not null, constraint "board_group_pkey" primary key ("id"));');
    this.addSql('alter table "board_group" add constraint "board_group_name_unique" unique ("name");');

    this.addSql('create table "board" ("identifier" varchar(255) not null, "board_group_id" varchar(255) not null, "name" varchar(255) not null, "post_count" int not null default 0, constraint "board_pkey" primary key ("identifier"));');
    this.addSql('alter table "board" add constraint "board_name_unique" unique ("name");');

    this.addSql('create table "post" ("board_identifier" varchar(255) not null, "post_id" int not null, "title" varchar(255) null, "media" varchar(255) not null, "content" varchar(255) not null, "type" text check ("type" in (\'thread\', \'reply\')) not null, constraint "post_pkey" primary key ("board_identifier", "post_id"));');
    this.addSql('create index "post_type_index" on "post" ("type");');
    this.addSql('alter table "post" add constraint "post_post_id_board_identifier_unique" unique ("post_id", "board_identifier");');

    this.addSql('create table "post_mentions" ("post_1_board_identifier" varchar(255) not null, "post_1_post_id" int not null, "post_2_board_identifier" varchar(255) not null, "post_2_post_id" int not null, constraint "post_mentions_pkey" primary key ("post_1_board_identifier", "post_1_post_id", "post_2_board_identifier", "post_2_post_id"));');

    this.addSql('alter table "board" add constraint "board_board_group_id_foreign" foreign key ("board_group_id") references "board_group" ("id") on update cascade;');

    this.addSql('alter table "post" add constraint "post_board_identifier_foreign" foreign key ("board_identifier") references "board" ("identifier") on update cascade;');

    this.addSql('alter table "post_mentions" add constraint "post_mentions_post_1_board_identifier_post_1_post_id_foreign" foreign key ("post_1_board_identifier", "post_1_post_id") references "post" ("board_identifier", "post_id") on update cascade on delete cascade;');
    this.addSql('alter table "post_mentions" add constraint "post_mentions_post_2_board_identifier_post_2_post_id_foreign" foreign key ("post_2_board_identifier", "post_2_post_id") references "post" ("board_identifier", "post_id") on update cascade on delete cascade;');
  }

}

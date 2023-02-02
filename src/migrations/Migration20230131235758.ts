import { Migration } from '@mikro-orm/migrations';

export class Migration20230131235758 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "media_content" ("id" varchar(255) not null, "created" timestamptz(0) not null, "updated" timestamptz(0) not null, "filename" varchar(255) not null, "mimetype" varchar(255) not null, "path" varchar(255) not null, constraint "media_content_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "media_content" cascade;');
  }

}

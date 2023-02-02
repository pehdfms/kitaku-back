import { Migration } from '@mikro-orm/migrations';

export class Migration20230201174333 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "media_content" add column "post_board_identifier" varchar(255) null, add column "post_post_id" int null;');
    this.addSql('alter table "media_content" add constraint "media_content_post_board_identifier_post_post_id_foreign" foreign key ("post_board_identifier", "post_post_id") references "post" ("board_identifier", "post_id") on update cascade on delete set null;');
    this.addSql('alter table "media_content" add constraint "media_content_post_board_identifier_post_post_id_unique" unique ("post_board_identifier", "post_post_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "media_content" drop constraint "media_content_post_board_identifier_post_post_id_foreign";');

    this.addSql('alter table "media_content" drop constraint "media_content_post_board_identifier_post_post_id_unique";');
    this.addSql('alter table "media_content" drop column "post_board_identifier";');
    this.addSql('alter table "media_content" drop column "post_post_id";');
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20230201172605 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post" alter column "content" type varchar(8192) using ("content"::varchar(8192));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "post" alter column "content" type varchar(16384) using ("content"::varchar(16384));');
  }

}

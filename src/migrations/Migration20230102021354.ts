import { Migration } from '@mikro-orm/migrations';

export class Migration20230102021354 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post" alter column "content" type varchar(16384) using ("content"::varchar(16384));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "post" alter column "content" type varchar(255) using ("content"::varchar(255));');
  }

}

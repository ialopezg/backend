import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTables1631745270917 implements MigrationInterface {
  name = 'UpdateTables1631745270917';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."users_auth" RENAME COLUMN "active" TO "is_email_confirmed"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."users_auth" RENAME COLUMN "is_email_confirmed" TO "active"`,
    );
  }
}

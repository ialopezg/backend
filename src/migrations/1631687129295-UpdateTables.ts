import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTables1631687129295 implements MigrationInterface {
  name = 'UpdateTables1631687129295';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."users_auth" DROP CONSTRAINT "FK_8d4681a2d24fe0a272f0f6cce7f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."users_auth" ADD "current_hashed_refresh_token" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."users_auth" ADD CONSTRAINT "FK_8d4681a2d24fe0a272f0f6cce7f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."users_auth" DROP CONSTRAINT "FK_8d4681a2d24fe0a272f0f6cce7f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."users_auth" DROP COLUMN "current_hashed_refresh_token"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."users_auth" ADD CONSTRAINT "FK_8d4681a2d24fe0a272f0f6cce7f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

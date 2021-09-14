import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersAuthTable1631649857300 implements MigrationInterface {
  name = 'CreateUsersAuthTable1631649857300';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "users_auth_role_enum" AS ENUM('USER_ROLE', 'ADMIN_ROLE', 'SU_ROLE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users_auth" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "users_auth_role_enum" NOT NULL DEFAULT 'USER_ROLE', "pin_code" integer NOT NULL, "password" character varying NOT NULL, "last_successful_logged_date" TIMESTAMP, "last_failed_logged_date" TIMESTAMP, "last_logout_date" TIMESTAMP, "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "user_id" integer, CONSTRAINT "UQ_e408bc41761f8c34601a140899f" UNIQUE ("pin_code"), CONSTRAINT "REL_8d4681a2d24fe0a272f0f6cce7" UNIQUE ("user_id"), CONSTRAINT "PK_32ddc1ae708e8261a870a6eb3e6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_auth" ADD CONSTRAINT "FK_8d4681a2d24fe0a272f0f6cce7f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_auth" DROP CONSTRAINT "FK_8d4681a2d24fe0a272f0f6cce7f"`,
    );
    await queryRunner.query(`DROP TABLE "users_auth"`);
    await queryRunner.query(`DROP TYPE "users_auth_role_enum"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTables1631740754645 implements MigrationInterface {
  name = 'UpdateTables1631740754645';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`,
    );
    await queryRunner.query(`ALTER TABLE "public"."users" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "public"."users_auth" ADD "email" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."users_auth" ADD CONSTRAINT "UQ_06288dfa12f07342f17cc767287" UNIQUE ("email")`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."users_auth" ADD "active" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."users_auth" DROP COLUMN "active"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."users_auth" DROP CONSTRAINT "UQ_06288dfa12f07342f17cc767287"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."users_auth" DROP COLUMN "email"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."users" ADD "email" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`,
    );
  }
}

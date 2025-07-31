import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1752715480506 implements MigrationInterface {
  name = 'CreateUserTable1752715480506';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Xóa bảng user nếu tồn tại
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
          CREATE TYPE "user_role_enum" AS ENUM ('CNBM', 'TM', 'GV', 'Student');
        END IF;
      END$$;
    `);

    // Tạo lại bảng user theo đúng entity mới
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" character varying(255) NOT NULL,
        "email" character varying(255) NOT NULL UNIQUE,
        "phone" character varying(20) NOT NULL,
        "role" "user_role_enum" NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "createdBy" character varying NOT NULL DEFAULT '',
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Nếu rollback thì xóa bảng user
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "user_role_enum"`);
  }
}

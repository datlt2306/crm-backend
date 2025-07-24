import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusColumnToActivitiesTable1753366074178
  implements MigrationInterface
{
  name = 'AddStatusColumnToActivitiesTable1753366074178';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_status_enum') THEN
          CREATE TYPE "activity_status_enum" AS ENUM ('NEW', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE');
        END IF;
      END
      $$;
    `);

    // Thêm cột status vào bảng activities
    await queryRunner.query(`
      ALTER TABLE "activities"
      ADD COLUMN IF NOT EXISTS "status" "activity_status_enum" NOT NULL DEFAULT 'NEW'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Xóa cột status
    await queryRunner.query(`
      ALTER TABLE "activities"
      DROP COLUMN IF EXISTS "status"
    `);

    // Xóa enum nếu không còn bảng nào dùng (cẩn thận khi dùng chung)
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_status_enum') THEN
          DROP TYPE "activity_status_enum";
        END IF;
      END
      $$;
    `);
  }
}

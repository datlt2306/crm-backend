import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPositionToStages1753979120768 implements MigrationInterface {
  name = 'AddPositionToStages1753979120768';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "stages"
      ADD "position" integer NOT NULL DEFAULT 0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "stages"
      DROP COLUMN "position"
    `);
  }
}

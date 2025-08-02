import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEstimateParentidToActivities1754135190409
  implements MigrationInterface
{
  name = 'AddEstimateParentidToActivities1754135190409';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "activities"
      ADD "estimateTime" integer
    `);
    await queryRunner.query(`
      ALTER TABLE "activities"
      ADD "parentId" uuid
    `);
    await queryRunner.query(`
      ALTER TABLE "activities"
      ADD CONSTRAINT "FK_activities_parentId" FOREIGN KEY ("parentId") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "activities" DROP CONSTRAINT "FK_activities_parentId"
    `);
    await queryRunner.query(`
      ALTER TABLE "activities" DROP COLUMN "parentId"
    `);
    await queryRunner.query(`
      ALTER TABLE "activities" DROP COLUMN "estimateTime"
    `);
  }
}

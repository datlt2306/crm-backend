import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSemesteridToActivities1753977918490
  implements MigrationInterface
{
  name = 'AddSemesteridToActivities1753977918490';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "activities"
            ADD "semesterId" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "activities"
            ADD CONSTRAINT "FK_activities_semesterId" FOREIGN KEY ("semesterId") REFERENCES "semesters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "activities" DROP CONSTRAINT "FK_activities_semesterId"
        `);
    await queryRunner.query(`
            ALTER TABLE "activities" DROP COLUMN "semesterId"
        `);
  }
}

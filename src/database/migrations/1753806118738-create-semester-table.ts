import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSemesterTable1753806118738 implements MigrationInterface {
  name = 'CreateSemesterTable1753806118738';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."semester_status_enum" AS ENUM('Ongoing', 'Completed', 'Upcoming')
    `);

    await queryRunner.query(`
      CREATE TABLE "semesters" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "startDate" TIMESTAMP NOT NULL,
        "endDate" TIMESTAMP NOT NULL,
        "description" text,
        "status" "public"."semester_status_enum" NOT NULL,
        "blocks" json,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "createdBy" character varying NOT NULL DEFAULT '',
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_semesters" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "semesters"`);
    await queryRunner.query(`DROP TYPE "public"."semester_status_enum"`);
  }
}

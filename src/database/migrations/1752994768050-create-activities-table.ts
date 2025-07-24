import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateActivitiesTables1752984000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE activity_type_enum AS ENUM ('task', 'event');
      CREATE TYPE activity_priority_enum AS ENUM ('low', 'medium', 'high', 'urgent');
      CREATE TYPE activity_category_enum AS ENUM ('seminar', 'workshop', 'tutor');
      CREATE TYPE participant_role_enum AS ENUM ('owner', 'executor', 'participant');
      CREATE TYPE participant_status_enum AS ENUM ('pending', 'accepted', 'rejected', 'joined');

      CREATE TABLE "activities" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar(255) NOT NULL,
        "type" activity_type_enum NOT NULL,
        "description" text,
        "priority" activity_priority_enum,
        "stageId" uuid REFERENCES "stages"("id"),
        "startTime" timestamptz,
        "endTime" timestamptz,
        "location" varchar(255),
        "onlineLink" varchar(255),
        "mandatory" boolean DEFAULT false,
        "category" activity_category_enum,
        "createdBy" uuid REFERENCES "users"("id"),
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE "activity_participants" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "activityId" uuid REFERENCES "activities"("id") ON DELETE CASCADE,
        "userId" uuid REFERENCES "users"("id"),
        "role" participant_role_enum NOT NULL,
        "status" participant_status_enum NOT NULL,
        "createdBy" character varying NOT NULL DEFAULT '',
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE "activity_files" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "activityId" uuid REFERENCES "activities"("id") ON DELETE CASCADE,
        "fileUrl" varchar(255) NOT NULL,
        "fileName" varchar(255) NOT NULL,
        "createdBy" character varying NOT NULL DEFAULT '',
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE "activity_feedback" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "activityId" uuid REFERENCES "activities"("id") ON DELETE CASCADE,
        "userId" uuid REFERENCES "users"("id"),
        "content" text NOT NULL,
        "submittedAt" timestamptz NOT NULL DEFAULT now(),
        "createdBy" character varying NOT NULL DEFAULT '',
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "activity_feedback"`);
    await queryRunner.query(`DROP TABLE "activity_files"`);
    await queryRunner.query(`DROP TABLE "activity_participants"`);
    await queryRunner.query(`DROP TABLE "activities"`);
    await queryRunner.query(`DROP TYPE IF EXISTS activity_type_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS activity_priority_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS activity_category_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS participant_role_enum`);
    await queryRunner.query(`DROP TYPE IF EXISTS participant_status_enum`);
  }
}

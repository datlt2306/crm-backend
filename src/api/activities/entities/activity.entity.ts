import { SemesterEntity } from '@/api/semester/entities/semester.entity';
import { StagesEntity } from '@/api/stages/entities/stage.entity';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import {
  ActivityCategory,
  ActivityPiority,
  ActivityStatus,
  ActivityType,
} from '@/database/enum/activity.enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ActivityAssigneeEntity } from './activity-assignee.entity';
import { ActivityFeedbackEntity } from './activity-feedback.entity';
import { ActivityFileEntity } from './activity-file.entity';
import { ActivityParticipantEntity } from './activity-participant.entity';

@Entity('activities')
export class ActivityEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'enum', enum: ActivityType })
  type: ActivityType;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: ActivityPiority, nullable: true })
  priority?: ActivityPiority;

  @ManyToOne(() => StagesEntity, { nullable: true })
  @JoinColumn({ name: 'stageId' })
  stage?: StagesEntity;

  @Column({ type: 'uuid', nullable: true })
  stageId?: string;

  @Column({ type: 'timestamptz', nullable: true })
  startTime?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  endTime?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  onlineLink?: string;

  @Column({ type: 'boolean', default: false })
  mandatory: boolean;

  @Column({ type: 'enum', enum: ActivityCategory, nullable: true })
  category?: ActivityCategory;
  @Column({ type: 'enum', enum: ActivityStatus, default: ActivityStatus.NEW })
  status: ActivityStatus;

  @Column({ type: 'uuid', nullable: false })
  semesterId: string;

  @OneToMany('ActivityParticipantEntity', 'activity', {
    cascade: true,
    lazy: true,
  })
  participants: Promise<ActivityParticipantEntity[]>;

  @OneToMany('ActivityFileEntity', 'activity', { cascade: true, lazy: true })
  files: Promise<ActivityFileEntity[]>;

  @OneToMany('ActivityFeedbackEntity', 'activity', {
    cascade: true,
    lazy: true,
  })
  feedbacks: Promise<ActivityFeedbackEntity[]>;

  @OneToMany('ActivityAssigneeEntity', 'activity', {
    lazy: true,
    cascade: true,
  })
  assignees: Promise<ActivityAssigneeEntity[]>;

  @ManyToOne(() => SemesterEntity, { nullable: false, eager: false })
  @JoinColumn({ name: 'semesterId' })
  semester: SemesterEntity;
}

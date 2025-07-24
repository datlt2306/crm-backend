import { UserEntity } from '@/api/users/entities/user.entity';
import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ActivityEntity } from './activity.entity';

@Entity('activity_feedback')
export class ActivityFeedbackEntity extends AbstractEntity {
  @ManyToOne(() => ActivityEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'activityId',
  })
  activity: ActivityEntity;

  @Column({ type: 'uuid' })
  activityId: string;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({
    name: 'userId',
  })
  user: UserEntity;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  submittedAt: Date;
}

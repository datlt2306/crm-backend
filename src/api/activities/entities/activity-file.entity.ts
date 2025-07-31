import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ActivityEntity } from './activity.entity';

@Entity('activity_files')
export class ActivityFileEntity extends AbstractEntity {
  @ManyToOne(() => ActivityEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'activityId' })
  activity: ActivityEntity;

  @Column({ type: 'uuid' })
  activityId: string;

  @Column({ type: 'varchar', length: 255 })
  fileUrl: string;

  @Column({ type: 'varchar', length: 255 })
  fileName: string;
}

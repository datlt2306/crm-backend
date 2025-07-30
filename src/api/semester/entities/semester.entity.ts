import { AbstractEntity } from '@/database/entities/abstract.entity';
import { SemesterStatus } from '@/database/enum/semeter.enum';
import { Column, Entity } from 'typeorm';

@Entity('semesters')
export class SemesterEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: SemesterStatus })
  status: SemesterStatus;

  @Column({ type: 'json', nullable: true })
  blocks: [{ name: string }];
}

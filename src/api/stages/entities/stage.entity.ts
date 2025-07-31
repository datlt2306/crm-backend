import { AbstractEntity } from '@/database/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('stages')
export class StagesEntity extends AbstractEntity {
  constructor(data?: Partial<StagesEntity>) {
    super();
    Object.assign(this, data);
  }
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  title: string;
}

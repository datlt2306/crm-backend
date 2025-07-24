import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class StageResDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  title: string;
}

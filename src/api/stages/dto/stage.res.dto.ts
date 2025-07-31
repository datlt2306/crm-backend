import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class StageResDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty({ example: 1, description: 'Vị trí của stage trong danh sách' })
  @Expose()
  position: number;
}

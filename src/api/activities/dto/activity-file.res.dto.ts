import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ActivityFileResDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  fileUrl: string;

  @ApiProperty()
  @Expose()
  fileName: string;
}

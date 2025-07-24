import { ActivityStatus } from '@/database/enum/activity.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class UpdateActivityStatusDto {
  @ApiProperty({ enum: ActivityStatus })
  @IsEnum(ActivityStatus)
  status: ActivityStatus;
}

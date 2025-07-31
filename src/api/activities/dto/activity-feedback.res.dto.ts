import { UserResDto } from '@/api/users/dto/user.res.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class ActivityFeedbackResDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ type: () => UserResDto })
  @Expose()
  @Type(() => UserResDto)
  user: UserResDto;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty()
  @Expose()
  submittedAt: Date;
}

import { UserResDto } from '@/api/users/dto/user.res.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class ActivityAssigneeResDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ type: () => UserResDto })
  @Expose()
  @Type(() => UserResDto)
  user: UserResDto;

  @ApiProperty()
  @Expose()
  role: string;

  @ApiProperty()
  @Expose()
  status: string;

  @ApiProperty()
  @Expose()
  assignedAt: Date;

  @ApiProperty()
  @Expose()
  note?: string;
}

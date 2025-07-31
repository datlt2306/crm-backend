import { Uuid } from '@/common/types/common.type';
import { AssigneeRole } from '@/database/enum/activity.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssignUserToActivityDto {
  @ApiProperty({
    description: 'ID hoặc danh sách ID của user được gán',
    type: [String],
    oneOf: [
      { type: 'string', format: 'uuid' },
      { type: 'array', items: { type: 'string', format: 'uuid' } },
    ],
    example: ['b1c2d3e4-f5a6-7890-1234-56789abcdef0'],
  })
  userId: Uuid | Uuid[];

  @ApiPropertyOptional({
    enum: AssigneeRole,
    description: 'Vai trò của user trong activity',
    example: AssigneeRole.COLLABORATOR,
  })
  role?: AssigneeRole;

  @ApiPropertyOptional({
    description: 'Ghi chú cho assignment',
    example: 'Phụ trách phần báo cáo',
  })
  note?: string;
}

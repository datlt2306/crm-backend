import { UserRole } from '@/database/enum/user.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResDto {
  @ApiProperty({ example: 'a0c83f2d-7fa2-4ad2-ac00-7b08e5cad3a8' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'John Doe' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'john.doe@email.com' })
  @Expose()
  email: string;

  @ApiProperty({ example: '0865294312' })
  @Expose()
  phone: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CNBM })
  @Expose()
  role: UserRole;

  @ApiProperty({ example: true })
  @Expose()
  isActive: boolean;

  @ApiProperty({ example: '2025-07-20T08:33:49.432Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '1108e1a1-4320-4acd-bd92-8a175310fbf6' })
  @Expose()
  createdBy: string;

  @ApiProperty({ example: '2025-07-20T08:33:49.432Z' })
  @Expose()
  updatedAt: Date;
}

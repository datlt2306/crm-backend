import { ParticipantRole } from '@/database/enum/activity.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateParticipantReqDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID của user',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    enum: ParticipantRole,
    example: ParticipantRole.PARTICIPANT,
  })
  @IsNotEmpty()
  @IsEnum(ParticipantRole)
  role: ParticipantRole;
}

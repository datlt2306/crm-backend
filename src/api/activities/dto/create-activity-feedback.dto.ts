import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateActivityFeedbackDto {
  @ApiProperty({ example: 'Bài này rất hay!' })
  @IsNotEmpty()
  @IsString()
  content: string;
}

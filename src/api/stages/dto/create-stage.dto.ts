import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStageDto {
  @ApiProperty({
    description: 'Title of the stage',
    example: 'Stage 1',
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}

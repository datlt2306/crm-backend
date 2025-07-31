import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateStageDto } from './create-stage.dto';

export class UpdateStageDto extends PartialType(CreateStageDto) {
  @ApiProperty({
    example: 'Stage 1 updated',
    description: 'Tên stage mới',
    required: false,
  })
  title?: string;

  @ApiProperty({
    example: 2,
    description: 'Vị trí mới của stage trong danh sách',
    required: false,
  })
  position?: number;
}

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSemesterDto } from './create-semester.dto';

export class UpdateSemesterDto extends PartialType(CreateSemesterDto) {
  @ApiProperty({
    description: 'ID của học kỳ cần cập nhật thông tin',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  id?: string;
}

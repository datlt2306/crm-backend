import { SemesterStatus } from '@/database/enum/semeter.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SemesterBlockResDto {
  @ApiProperty({
    description: 'Tên của block học tập',
    example: 'Block 1',
  })
  @Expose()
  name: string;
}

export class SemesterResDto {
  @ApiProperty({
    description: 'ID duy nhất của học kỳ',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Tên học kỳ',
    example: 'Học kỳ 1 năm 2024',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Ngày bắt đầu học kỳ',
    example: '2024-09-01T00:00:00.000Z',
  })
  @Expose()
  startDate: Date;

  @ApiProperty({
    description: 'Ngày kết thúc học kỳ',
    example: '2024-12-31T23:59:59.000Z',
  })
  @Expose()
  endDate: Date;

  @ApiProperty({
    description: 'Mô tả chi tiết về học kỳ',
    example: 'Học kỳ 1 năm học 2024-2025 với các hoạt động ngoại khóa',
    required: false,
  })
  @Expose()
  description?: string;

  @ApiProperty({
    description: 'Trạng thái hiện tại của học kỳ',
    enum: SemesterStatus,
    example: SemesterStatus.ONGOING,
  })
  @Expose()
  status: SemesterStatus;

  @ApiProperty({
    description: 'Danh sách các block học tập trong học kỳ',
    type: [SemesterBlockResDto],
    example: [{ name: 'Block 1' }, { name: 'Block 2' }],
  })
  @Expose()
  blocks: SemesterBlockResDto[];

  @ApiProperty({
    description: 'Thời gian tạo học kỳ',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật thông tin học kỳ lần cuối',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;
}

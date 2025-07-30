import { SemesterStatus } from '@/database/enum/semeter.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class BlockDto {
  @ApiProperty({
    description: 'Tên của block học tập',
    example: 'Block 1',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string;
}

export class CreateSemesterDto {
  @ApiProperty({
    description: 'Tên học kỳ (ví dụ: Học kỳ 1 năm 2024)',
    example: 'Học kỳ 1 năm 2024',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Ngày bắt đầu học kỳ (định dạng ISO)',
    example: '2024-09-01T00:00:00.000Z',
    required: true,
  })
  @IsDate()
  @Type(() => Date)
  @Expose()
  startDate: Date;

  @ApiProperty({
    description: 'Ngày kết thúc học kỳ (phải sau ngày bắt đầu)',
    example: '2024-12-31T23:59:59.000Z',
    required: true,
  })
  @IsDate()
  @Type(() => Date)
  @Expose()
  endDate: Date;

  @ApiProperty({
    description: 'Mô tả chi tiết về học kỳ (không bắt buộc)',
    example: 'Học kỳ 1 năm học 2024-2025 với các hoạt động ngoại khóa',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Expose()
  description?: string;

  @ApiProperty({
    description:
      'Trạng thái học kỳ: Ongoing (Đang diễn ra), Completed (Đã hoàn thành), Upcoming (Sắp diễn ra)',
    enum: SemesterStatus,
    example: SemesterStatus.ONGOING,
    required: true,
  })
  @IsEnum(SemesterStatus)
  @Expose()
  status: SemesterStatus;

  @ApiProperty({
    description:
      'Danh sách các block học tập trong học kỳ (thường có 2 block: Block 1 và Block 2)',
    type: [BlockDto],
    example: [{ name: 'Block 1' }, { name: 'Block 2' }],
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BlockDto)
  @Expose()
  blocks?: BlockDto[];
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AttachFileDto {
  @ApiProperty({
    description: 'URL của file đính kèm',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  @ApiProperty({
    description: 'Tên của file',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;
}

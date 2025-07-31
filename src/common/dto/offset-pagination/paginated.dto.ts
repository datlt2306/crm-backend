import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { OffsetPaginationDto } from './offset-pagination.dto';

export class OffsetPaginatedDto<TData> {
  @ApiProperty({ type: [Object] })
  @Expose()
  readonly data: TData[];

  @ApiProperty()
  @Expose()
  pagination: OffsetPaginationDto;

  @ApiProperty()
  @Expose()
  statusCode: number;

  @ApiProperty()
  @Expose()
  message: string;

  @ApiProperty()
  @Expose()
  timestamp: Date;

  constructor({
    data,
    meta,
    statusCode = 200,
    message = 'OK',
  }: {
    data: TData[];
    meta: OffsetPaginationDto;
    statusCode?: number;
    message?: string;
  }) {
    this.data = data;
    this.pagination = meta;
    this.statusCode = statusCode;
    this.message = message;
    this.timestamp = new Date();
  }
}

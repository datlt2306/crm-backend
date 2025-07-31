import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CursorPaginationDto } from './cursor-pagination.dto';

export class CursorPaginatedDto<TData> {
  @ApiProperty({ type: [Object] })
  @Expose()
  readonly data: TData[];

  @ApiProperty()
  @Expose()
  pagination: CursorPaginationDto;

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
    meta: CursorPaginationDto;
    statusCode?: number;
    message?: string;
  }) {
    this.data = data;
    this.pagination = meta;
    this.statusCode = statusCode;
    this.message = message;
  }
}

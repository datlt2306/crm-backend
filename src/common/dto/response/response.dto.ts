import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseDto<TData> {
  @ApiProperty({ type: [Object] })
  @Expose()
  readonly data: TData;

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
    statusCode = 200,
    message = 'Success',
  }: {
    data: TData;
    statusCode?: number;
    message?: string;
  }) {
    this.data = data;
    this.statusCode = statusCode;
    this.message = message;
    this.timestamp = new Date();
  }
}

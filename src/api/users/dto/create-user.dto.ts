import { UserRole } from '@/database/enum/user.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsPhoneNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'user@example.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '1234567890',
  })
  @IsString()
  @IsPhoneNumber('VN')
  phone: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;
}

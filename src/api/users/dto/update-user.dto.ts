import { UserRole } from '@/database/enum/user.enum';
import { BooleanFieldOptional } from '@/decorators/field.decorators';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    enum: UserRole,
    description: 'Role of the user',
    required: false,
  })
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({
    description: 'Indicates if the user is active',
    required: false,
    type: Boolean,
  })
  @BooleanFieldOptional()
  isActive?: boolean;
}

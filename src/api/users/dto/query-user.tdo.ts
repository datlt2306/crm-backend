import { PageOptionsDto } from '@/common/dto/offset-pagination/page-options.dto';
import { UserRole } from '@/database/enum/user.enum';
import { EnumFieldOptional } from '@/decorators/field.decorators';

export class QueryUserDto extends PageOptionsDto {
  @EnumFieldOptional(() => UserRole, {
    default: UserRole.Student,
  })
  role?: UserRole;
}

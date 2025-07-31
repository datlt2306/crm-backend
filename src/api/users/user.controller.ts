import { PageOptionsDto } from '@/common/dto/offset-pagination/page-options.dto';
import { Uuid } from '@/common/types/common.type';
import { UserRole } from '@/database/enum/user.enum';
import { ApiAuth, ApiPublic } from '@/decorators/http.decorators';
import { Roles } from '@/decorators/roles.decorator';
import { RolesGuard } from '@/guards/roles.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResDto } from './dto/user.res.dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(UserRole.CNBM, UserRole.TM)
  @ApiPublic({
    summary: 'Create user',
    type: CreateUserDto,
  })
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @ApiAuth({
    summary: 'Get all users',
    description: 'Retrieve a paginated list of all users in the system.',
    isPaginated: true,
    type: UserResDto,
  })
  @Roles(UserRole.TM, UserRole.CNBM)
  @UseGuards(RolesGuard)
  @Get('all')
  findAll(@Query() query: PageOptionsDto) {
    return this.userService.findAll(query);
  }

  @Post('import')
  @Roles(UserRole.CNBM, UserRole.TM)
  @UseInterceptors(FileInterceptor('file'))
  @ApiAuth({
    summary: 'Import users from file',
    description: 'Upload a file to import users in bulk.',
  })
  importUsers(@UploadedFile() file: Express.Multer.File) {
    return this.userService.importUsers(file);
  }

  @Delete(':id')
  @Roles(UserRole.CNBM, UserRole.TM)
  @ApiAuth({
    summary: 'Delete user',
    errorResponses: [400, 401, 403, 404, 500],
  })
  @ApiParam({ name: 'id', type: 'String' })
  removeUser(@Param('id', ParseUUIDPipe) id: Uuid) {
    return this.userService.remove(id);
  }
}

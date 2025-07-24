import { Uuid } from '@/common/types/common.type';
import { UserRole } from '@/database/enum/user.enum';
import { ApiAuth } from '@/decorators/http.decorators';
import { Roles } from '@/decorators/roles.decorator';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { ActivityResDto } from './dto/activity.res.dto';
import { CreateActivityDto } from './dto/create-activity.dto';
import { QueryActivityDto } from './dto/query-activity.dto';
import { UpdateActivityStatusDto } from './dto/update-activity-status.dto';

@ApiTags('Activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @ApiAuth({ summary: 'Tạo mới activity', type: CreateActivityDto })
  @Roles(UserRole.CNBM, UserRole.TM)
  createActivity(@Body() dto: CreateActivityDto) {
    return this.activitiesService.create(dto);
  }

  @Get()
  @ApiAuth({
    summary: 'Lấy danh sách activities',
    isPaginated: true,
    type: ActivityResDto,
  })
  getActivities(@Query() query: QueryActivityDto) {
    return this.activitiesService.findAll(query);
  }

  @Patch(':id/status')
  @ApiAuth({
    summary: 'Cập nhật trạng thái công việc',
    description: 'Chỉ giảng viên, trưởng môn, chủ nhiệm bộ môn được phép',
    type: UpdateActivityStatusDto,
    auths: ['jwt'],
  })
  @ApiParam({
    name: 'id',
    description: 'ID của activity cần cập nhật trạng thái',
  })
  @Roles(UserRole.CNBM, UserRole.TM, UserRole.GV)
  updateStatus(@Param('id') id: Uuid, @Body() dto: UpdateActivityStatusDto) {
    return this.activitiesService.updateStatus(id, dto);
  }
}

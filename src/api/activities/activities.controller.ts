import { ResponseNoDataDto } from '@/common/dto/response/response-no-data.dto';
import { Uuid } from '@/common/types/common.type';
import { UserRole } from '@/database/enum/user.enum';
import { ApiAuth } from '@/decorators/http.decorators';
import { Roles } from '@/decorators/roles.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { ActivityFileResDto } from './dto/activity-file.res.dto';
import { ActivityResDto } from './dto/activity.res.dto';
import { AttachFileDto } from './dto/attach-file.dto';
import { CreateActivityDto } from './dto/create-activity.dto';
import { QueryActivityDto } from './dto/query-activity.dto';
import { UpdateActivityStatusDto } from './dto/update-activity-status.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { UpdateParticipantReqDto } from './dto/update-participant.req.dto';

@ApiTags('Activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @ApiAuth({ summary: 'Tạo mới activity', type: ActivityResDto })
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
    type: ActivityResDto,
  })
  @ApiParam({
    name: 'id',
    description: 'ID của activity cần cập nhật trạng thái',
  })
  @Roles(UserRole.CNBM, UserRole.TM, UserRole.GV)
  updateStatus(@Param('id') id: Uuid, @Body() dto: UpdateActivityStatusDto) {
    return this.activitiesService.updateStatus(id, dto);
  }

  @Get(':id')
  @ApiAuth({
    summary: 'Lấy thông tin activity theo ID',
    type: ActivityResDto,
  })
  @ApiParam({
    name: 'id',
    description: 'ID của activity cần lấy thông tin',
  })
  getActivityById(@Param('id') id: Uuid) {
    return this.activitiesService.findById(id);
  }

  @Delete(':id')
  @ApiAuth({
    summary: 'Xóa activity theo ID',
    description: 'Chỉ giảng viên, trưởng môn, chủ nhiệm bộ môn được phép',
    type: ResponseNoDataDto,
  })
  @ApiParam({
    name: 'id',
    description: 'ID của activity cần xóa',
  })
  deleteActivity(@Param('id') id: Uuid) {
    return this.activitiesService.deleteActivity(id);
  }

  @Patch(':id')
  @ApiAuth({
    summary: 'Cập nhật activity theo ID',
    description: 'Chỉ giảng viên, trưởng môn, chủ nhiệm bộ môn được phép',
    type: ActivityResDto,
  })
  @ApiParam({
    name: 'id',
    description: 'ID của activity cần cập nhật',
  })
  @Roles(UserRole.CNBM, UserRole.TM, UserRole.GV)
  updateActivity(@Param('id') id: Uuid, @Body() dto: UpdateActivityDto) {
    return this.activitiesService.updateActivity(id, dto);
  }

  @Post(':id/files')
  @ApiAuth({
    summary: 'Đính kèm file cho activity',
    type: ActivityFileResDto,
  })
  @ApiParam({ name: 'id', description: 'ID của activity' })
  async attachFile(@Param('id') id: Uuid, @Body() dto: AttachFileDto) {
    return this.activitiesService.attachFile(id, dto);
  }

  @Get(':id/files')
  @ApiAuth({
    summary: 'Lấy danh sách file đính kèm của activity',
    type: ActivityFileResDto,
  })
  @ApiParam({ name: 'id', description: 'ID của activity' })
  getFiles(@Param('id') id: Uuid) {
    return this.activitiesService.getFiles(id);
  }

  @Patch(':id/participants')
  @ApiAuth({ summary: 'Cập nhật participant', type: UpdateParticipantReqDto })
  @ApiParam({
    name: 'id',
    description: 'ID của activity để cập nhật participants',
  })
  @Roles(UserRole.CNBM, UserRole.TM)
  updateParticipants(
    @Param('id') id: Uuid,
    @Body() dto: UpdateParticipantReqDto,
  ) {
    return this.activitiesService.updateParticipants(id, dto);
  }
}

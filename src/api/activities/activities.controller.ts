import { UserRole } from '@/database/enum/user.enum';
import { ApiAuth } from '@/decorators/http.decorators';
import { Roles } from '@/decorators/roles.decorator';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { ActivityResDto } from './dto/activity.res.dto';
import { CreateActivityDto } from './dto/create-activity.dto';
import { QueryActivityDto } from './dto/query-activity.dto';

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
}

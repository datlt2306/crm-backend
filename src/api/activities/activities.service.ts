import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { BaseService } from '@/services/base.service';
import { paginate } from '@/utils/offset-pagination';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { ActivityResDto } from './dto/activity.res.dto';
import { CreateActivityDto } from './dto/create-activity.dto';
import { QueryActivityDto } from './dto/query-activity.dto';
import { ActivityEntity } from './entities/activity.entity';

@Injectable()
export class ActivitiesService extends BaseService<ActivityEntity> {
  constructor(
    @InjectRepository(ActivityEntity)
    private readonly activityRepo: Repository<ActivityEntity>,
  ) {
    super(activityRepo);
  }

  async create(dto: CreateActivityDto): Promise<ActivityEntity> {
    const activity = this.activityRepo.create(dto);
    return await this.activityRepo.save(activity);
  }

  async findAll(
    query: QueryActivityDto,
  ): Promise<OffsetPaginatedDto<ActivityResDto>> {
    const qb = this.activityRepo.createQueryBuilder('activity');

    if (query.q) {
      qb.andWhere(
        'activity.name ILIKE :search OR activity.description ILIKE :search',
        { search: `%${query.q}%` },
      );
    }
    if (query.type) qb.andWhere('activity.type = :type', { type: query.type });
    if (query.priority)
      qb.andWhere('activity.priority = :priority', {
        priority: query.priority,
      });
    if (query.stageId)
      qb.andWhere('activity.stageId = :stageId', { stageId: query.stageId });
    if (query.category)
      qb.andWhere('activity.category = :category', {
        category: query.category,
      });
    if (query.mandatory !== undefined)
      qb.andWhere('activity.mandatory = :mandatory', {
        mandatory: query.mandatory,
      });
    if (query.startTimeFrom)
      qb.andWhere('activity.startTime >= :startTimeFrom', {
        startTimeFrom: query.startTimeFrom,
      });
    if (query.endTimeTo)
      qb.andWhere('activity.endTime <= :endTimeTo', {
        endTimeTo: query.endTimeTo,
      });
    if (query.createdBy)
      qb.andWhere('activity.createdBy = :createdBy', {
        createdBy: query.createdBy,
      });
    qb.orderBy('activity.createdAt', 'DESC');

    const [activities, metaDto] = await paginate<ActivityEntity>(qb, query, {
      skipCount: false,
      takeAll: false,
    });

    return new OffsetPaginatedDto(
      plainToInstance(ActivityResDto, activities),
      metaDto,
    );
  }
}

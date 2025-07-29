import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { ResponseNoDataDto } from '@/common/dto/response/response-no-data.dto';
import { ResponseDto } from '@/common/dto/response/response.dto';
import { Uuid } from '@/common/types/common.type';
import { ParticipantStatus } from '@/database/enum/activity.enum';
import { BaseService } from '@/services/base.service';
import { paginate } from '@/utils/offset-pagination';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { ActivityResDto } from './dto/activity.res.dto';
import { AttachFileDto } from './dto/attach-file.dto';
import { AttachFileResDto } from './dto/attach-file.res.dto';
import { CreateActivityDto } from './dto/create-activity.dto';
import { QueryActivityDto } from './dto/query-activity.dto';
import { UpdateActivityStatusDto } from './dto/update-activity-status.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { UpdateParticipantReqDto } from './dto/update-participant.req.dto';
import { ActivityFileEntity } from './entities/activity-file.entity';
import { ActivityParticipantEntity } from './entities/activity-participant.entity';
import { ActivityEntity } from './entities/activity.entity';

@Injectable()
export class ActivitiesService extends BaseService<ActivityEntity> {
  constructor(
    @InjectRepository(ActivityEntity)
    private readonly activityRepo: Repository<ActivityEntity>,
    @InjectRepository(ActivityFileEntity)
    private readonly activityFileRepo: Repository<ActivityFileEntity>,
    @InjectRepository(ActivityParticipantEntity)
    private readonly participantRepo: Repository<ActivityParticipantEntity>,
  ) {
    super(activityRepo);
  }

  async create(dto: CreateActivityDto): Promise<ResponseDto<ActivityResDto>> {
    if (dto.type === 'event') {
      if (!dto.startTime || !dto.endTime || !dto.location) {
        throw new BadRequestException(
          'Event phải có startTime, endTime, location',
        );
      }
    }
    // if (dto.type === 'task') {
    //   if (dto.startTime || dto.endTime || dto.location) {
    //     throw new BadRequestException(
    //       'Task không được truyền startTime, endTime, location',
    //     );
    //   }
    // }

    const activity = this.activityRepo.create(dto);
    const res = await this.activityRepo.save(activity);

    return new ResponseDto<ActivityResDto>({
      data: plainToInstance(ActivityResDto, res, {
        excludeExtraneousValues: true,
      }),
      message: 'Activity created successfully',
    });
  }

  async findAll(
    query: QueryActivityDto,
  ): Promise<OffsetPaginatedDto<ActivityResDto>> {
    const qb = this.activityRepo
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'user')
      .leftJoinAndSelect('activity.files', 'files')
      .leftJoinAndSelect('activity.feedbacks', 'feedbacks')
      .leftJoinAndSelect('feedbacks.user', 'feedbackUser');
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
      plainToInstance(ActivityResDto, activities, {
        excludeExtraneousValues: true,
      }),
      metaDto,
    );
  }
  async updateStatus(id: Uuid, dto: UpdateActivityStatusDto) {
    const activity = await this.activityRepo.findOneOrFail({ where: { id } });
    activity.status = dto.status;
    return this.activityRepo.save(activity);
  }

  async findById(id: Uuid): Promise<ResponseDto<ActivityResDto>> {
    const activity = await this.activityRepo.findOneOrFail({
      where: { id },
      relations: [
        'participants',
        'participants.user',
        'files',
        'feedbacks',
        'feedbacks.user',
      ],
    });
    return new ResponseDto<ActivityResDto>({
      data: plainToInstance(ActivityResDto, activity, {
        excludeExtraneousValues: true,
      }),
      message: 'Activity retrieved successfully',
    });
  }

  async deleteActivity(id: Uuid): Promise<ResponseNoDataDto> {
    await this.activityRepo.delete(id);
    //TODO: handle clear file manualy here
    return new ResponseNoDataDto({
      message: 'Activity deleted successfully',
    });
  }

  async updateActivity(
    id: Uuid,
    dto: UpdateActivityDto,
  ): Promise<ResponseDto<ActivityResDto>> {
    const activity = await this.activityRepo.findOneOrFail({ where: { id } });
    Object.assign(activity, dto);
    await this.activityRepo.save(activity);
    return new ResponseDto<ActivityResDto>({
      data: plainToInstance(ActivityResDto, activity, {
        excludeExtraneousValues: true,
      }),
      message: 'Activity updated successfully',
    });
  }

  async attachFile(
    id: Uuid,
    dto: AttachFileDto,
  ): Promise<ResponseDto<ActivityResDto>> {
    return await this.activityRepo.manager.transaction(async (manager) => {
      const activityFile = manager.create(ActivityFileEntity, {
        activityId: id,
        fileUrl: dto.fileUrl,
        fileName: dto.fileName,
      });

      await this.activityFileRepo.save(activityFile);

      const updatedActivity = await manager.findOneOrFail(ActivityEntity, {
        where: { id },
        relations: ['files'],
      });

      return new ResponseDto<ActivityResDto>({
        data: plainToInstance(ActivityResDto, updatedActivity, {
          excludeExtraneousValues: true,
        }),
        message: 'File attached successfully',
      });
    });
  }

  async getFiles(id: Uuid): Promise<ResponseDto<AttachFileResDto[]>> {
    const files = await this.activityFileRepo.find({
      where: { activityId: id },
    });

    if (files.length === 0) {
      return new ResponseDto<AttachFileResDto[]>({
        data: [],
        message: 'No files found for this activity',
      });
    }

    return new ResponseDto<AttachFileResDto[]>({
      data: plainToInstance(AttachFileResDto, files, {
        excludeExtraneousValues: true,
      }),
      message: 'Files retrieved successfully',
    });
  }

  async updateParticipants(id: Uuid, dto: UpdateParticipantReqDto) {
    const activity = await this.activityRepo.findOne({
      where: { id },
    });
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }
    let participant = await this.participantRepo.findOne({
      where: { activityId: id, userId: dto.userId },
    });
    if (participant) {
      participant.role = dto.role;
    } else {
      participant = this.participantRepo.create({
        activityId: id,
        userId: dto.userId,
        role: dto.role,
        status: ParticipantStatus.ACCEPTED,
      });
    }
    await this.participantRepo.save(participant);
    return participant;
  }
}

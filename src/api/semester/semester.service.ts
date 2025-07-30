import { OffsetPaginatedDto } from '@/common/dto/offset-pagination/paginated.dto';
import { PageOptionsDto } from '@/common/dto/offset-pagination/page-options.dto';
import { ResponseNoDataDto } from '@/common/dto/response/response-no-data.dto';
import { ResponseDto } from '@/common/dto/response/response.dto';
import { Uuid } from '@/common/types/common.type';
import { SemesterStatus } from '@/database/enum/semeter.enum';
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
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { SemesterResDto } from './dto/semester.res.dto';
import { SemesterEntity } from './entities/semester.entity';

@Injectable()
export class SemesterService extends BaseService<SemesterEntity> {
  constructor(
    @InjectRepository(SemesterEntity)
    private readonly semesterRepo: Repository<SemesterEntity>,
  ) {
    super(semesterRepo);
  }

  async create(dto: CreateSemesterDto): Promise<ResponseDto<SemesterResDto>> {
    if (dto.startDate >= dto.endDate) {
      throw new BadRequestException(
        'Start date must be before end date',
      );
    }

    const semester = this.semesterRepo.create(dto);
    const res = await this.semesterRepo.save(semester);

    return new ResponseDto<SemesterResDto>({
      data: plainToInstance(SemesterResDto, res, {
        excludeExtraneousValues: true,
      }),
      message: 'Semester created successfully',
    });
  }

  async findAll(query: PageOptionsDto): Promise<OffsetPaginatedDto<SemesterResDto>> {
    const qb = this.semesterRepo
      .createQueryBuilder('semester')
      .orderBy('semester.createdAt', 'DESC');

    const [semesters, metaDto] = await paginate<SemesterEntity>(qb, query, {
      skipCount: false,
      takeAll: false,
    });

    return new OffsetPaginatedDto(
      plainToInstance(SemesterResDto, semesters, {
        excludeExtraneousValues: true,
      }),
      metaDto,
    );
  }

  async findById(id: Uuid): Promise<ResponseDto<SemesterResDto>> {
    const semester = await this.semesterRepo.findOneOrFail({
      where: { id },
    });
    
    return new ResponseDto<SemesterResDto>({
      data: plainToInstance(SemesterResDto, semester, {
        excludeExtraneousValues: true,
      }),
      message: 'Semester retrieved successfully',
    });
  }

  async deleteSemester(id: Uuid): Promise<ResponseNoDataDto> {
    await this.semesterRepo.delete(id);
    
    return new ResponseNoDataDto({
      message: 'Semester deleted successfully',
    });
  }

  async updateSemester(
    id: Uuid,
    dto: UpdateSemesterDto,
  ): Promise<ResponseDto<SemesterResDto>> {
    const semester = await this.semesterRepo.findOneOrFail({ where: { id } });
    
    if (dto.startDate && dto.endDate && dto.startDate >= dto.endDate) {
      throw new BadRequestException(
        'Start date must be before end date',
      );
    }

    Object.assign(semester, dto);
    await this.semesterRepo.save(semester);
    
    return new ResponseDto<SemesterResDto>({
      data: plainToInstance(SemesterResDto, semester, {
        excludeExtraneousValues: true,
      }),
      message: 'Semester updated successfully',
    });
  }

  async findActiveSemester(): Promise<ResponseDto<SemesterResDto>> {
    const semester = await this.semesterRepo.findOne({
      where: { status: SemesterStatus.ONGOING },
      order: { createdAt: 'DESC' },
    });

    if (!semester) {
      throw new NotFoundException('No active semester found');
    }

    return new ResponseDto<SemesterResDto>({
      data: plainToInstance(SemesterResDto, semester, {
        excludeExtraneousValues: true,
      }),
      message: 'Active semester retrieved successfully',
    });
  }
}

import { ResponseNoDataDto } from '@/common/dto/response/response-no-data.dto';
import { ResponseDto } from '@/common/dto/response/response.dto';
import { Uuid } from '@/common/types/common.type';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { CreateStageDto } from './dto/create-stage.dto';
import { StageResDto } from './dto/stage.res.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { StagesEntity } from './entities/stage.entity';

@Injectable()
export class StagesService {
  constructor(
    @InjectRepository(StagesEntity)
    private readonly stagesRepository: Repository<StagesEntity>,
  ) {}

  async create(
    createStageDto: CreateStageDto,
  ): Promise<ResponseDto<StageResDto>> {
    let position = createStageDto.position;

    if (position === undefined || position === null) {
      // Lấy position lớn nhất hiện tại
      const max = await this.stagesRepository
        .createQueryBuilder('stage')
        .select('MAX(stage.position)', 'max')
        .getRawOne();
      position = (max?.max ?? 0) + 1;
    }

    const stage = this.stagesRepository.create({
      ...createStageDto,
      position,
    });
    await this.stagesRepository.save(stage);

    return new ResponseDto<StageResDto>({
      data: plainToInstance(StageResDto, stage, {
        excludeExtraneousValues: true,
      }),
      message: 'Stage created successfully',
    });
  }

  async findAll(): Promise<ResponseDto<StageResDto[]>> {
    const stages = await this.stagesRepository.find();
    return new ResponseDto<StageResDto[]>({
      data: plainToInstance(StageResDto, stages, {
        excludeExtraneousValues: true,
      }),
      message: 'Stages retrieved successfully',
    });
  }

  async findOne(id: Uuid): Promise<ResponseDto<StageResDto>> {
    const stage = await this.stagesRepository.findOne({ where: { id } });
    if (!stage) throw new NotFoundException('Stage not found');
    return new ResponseDto<StageResDto>({
      data: plainToInstance(StageResDto, stage, {
        excludeExtraneousValues: true,
      }),
      message: 'Stage retrieved successfully',
    });
  }

  async update(
    id: Uuid,
    updateStageDto: UpdateStageDto,
  ): Promise<ResponseDto<StageResDto>> {
    const stageEntity = await this.stagesRepository.findOne({ where: { id } });
    if (!stageEntity) throw new NotFoundException('Stage not found');

    // Lấy tổng số stage hiện tại
    const count = await this.stagesRepository.count();

    // Nếu có truyền position và khác vị trí cũ thì cần cập nhật lại thứ tự
    if (
      updateStageDto.position !== undefined &&
      updateStageDto.position !== null &&
      updateStageDto.position !== stageEntity.position
    ) {
      let newPosition = updateStageDto.position;

      // Giới hạn newPosition trong khoảng hợp lệ
      if (newPosition < 0) newPosition = 0;
      if (newPosition >= count) newPosition = count - 1;

      const oldPosition = stageEntity.position;

      // Nếu kéo lên (vị trí nhỏ hơn)
      if (newPosition < oldPosition) {
        await this.stagesRepository
          .createQueryBuilder()
          .update(StagesEntity)
          .set({ position: () => '"position" + 1' })
          .where('"position" >= :newPosition AND "position" < :oldPosition', {
            newPosition,
            oldPosition,
          })
          .execute();
      }
      // Nếu kéo xuống (vị trí lớn hơn)
      else if (newPosition > oldPosition) {
        await this.stagesRepository
          .createQueryBuilder()
          .update(StagesEntity)
          .set({ position: () => '"position" - 1' })
          .where('"position" <= :newPosition AND "position" > :oldPosition', {
            newPosition,
            oldPosition,
          })
          .execute();
      }

      stageEntity.position = newPosition;
    }

    // Cập nhật các trường khác
    Object.assign(stageEntity, updateStageDto, {
      position: stageEntity.position,
    });

    const savedStage = await this.stagesRepository.save(stageEntity);

    return new ResponseDto<StageResDto>({
      data: plainToInstance(StageResDto, savedStage, {
        excludeExtraneousValues: true,
      }),
      message: 'Stage updated successfully',
    });
  }

  // 97e4a9ed-1007-4744-bda4-bee0c31a0431
  async remove(id: Uuid): Promise<ResponseNoDataDto> {
    const stageEntity = await this.stagesRepository.findOne({ where: { id } });
    if (!stageEntity) throw new NotFoundException('Stage not found');
    await this.stagesRepository.remove(stageEntity);

    return new ResponseNoDataDto({
      message: 'Stage removed successfully',
    });
  }
}

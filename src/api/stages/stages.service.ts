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

  async create(createStageDto: CreateStageDto): Promise<StagesEntity> {
    const stage = this.stagesRepository.create(createStageDto);
    return await this.stagesRepository.save(stage);
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
    Object.assign(stageEntity, updateStageDto);
    const savedStage = await this.stagesRepository.save(stageEntity);

    return new ResponseDto<StageResDto>({
      data: plainToInstance(StageResDto, savedStage, {
        excludeExtraneousValues: true,
      }),
      message: 'Stage updated successfully',
    });
  }

  async remove(id: Uuid): Promise<ResponseNoDataDto> {
    const stageEntity = await this.stagesRepository.findOne({ where: { id } });
    if (!stageEntity) throw new NotFoundException('Stage not found');
    await this.stagesRepository.remove(stageEntity);

    return new ResponseNoDataDto({
      message: 'Stage removed successfully',
    });
  }
}

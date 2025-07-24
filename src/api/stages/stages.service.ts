import { Uuid } from '@/common/types/common.type';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStageDto } from './dto/create-stage.dto';
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

  async findAll(): Promise<StagesEntity[]> {
    return await this.stagesRepository.find();
  }

  async findOne(id: Uuid): Promise<StagesEntity> {
    const stage = await this.stagesRepository.findOne({ where: { id } });
    if (!stage) throw new NotFoundException('Stage not found');
    return stage;
  }

  async update(
    id: Uuid,
    updateStageDto: UpdateStageDto,
  ): Promise<StagesEntity> {
    const stage = await this.findOne(id);
    Object.assign(stage, updateStageDto);
    return await this.stagesRepository.save(stage);
  }

  async remove(id: Uuid): Promise<void> {
    const stage = await this.findOne(id);
    await this.stagesRepository.remove(stage);
  }
}

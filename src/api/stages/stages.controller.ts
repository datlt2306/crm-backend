import { Uuid } from '@/common/types/common.type';
import { ApiAuth, ApiPublic } from '@/decorators/http.decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateStageDto } from './dto/create-stage.dto';
import { StageDto } from './dto/stage.dto';
import { UpdateStageDto } from './dto/update-stage.dto';
import { StagesService } from './stages.service';

@ApiTags('Stages')
@Controller('stages')
export class StagesController {
  constructor(private readonly stagesService: StagesService) {}

  @Post()
  @ApiAuth({
    summary: 'Tạo stage mới',
    auths: ['jwt'],
    statusCode: 201,
    type: StageDto,
  })
  async create(@Body() createStageDto: CreateStageDto): Promise<StageDto> {
    const stage = await this.stagesService.create(createStageDto);
    return stage.toDto(StageDto);
  }

  @Get()
  @ApiPublic({
    summary: 'Lấy danh sách tất cả stage',
    statusCode: 200,
    type: StageDto,
  })
  async findAll(): Promise<StageDto[]> {
    const stages = await this.stagesService.findAll();
    return stages.map((s) => s.toDto(StageDto));
  }

  @Get(':id')
  @ApiPublic({ summary: 'Lấy thông tin stage theo id' })
  @ApiResponse({ status: 200, type: StageDto })
  async findOne(@Param('id') id: Uuid): Promise<StageDto> {
    const stage = await this.stagesService.findOne(id);
    return stage.toDto(StageDto);
  }

  @Patch(':id')
  @ApiAuth({
    summary: 'Cập nhật stage',
    statusCode: 200,
    type: UpdateStageDto,
  })
  async update(
    @Param('id') id: Uuid,
    @Body() updateStageDto: UpdateStageDto,
  ): Promise<StageDto> {
    const stage = await this.stagesService.update(id, updateStageDto);
    return stage.toDto(StageDto);
  }

  @Delete(':id')
  @ApiAuth({
    summary: 'Xóa stage',
    statusCode: 204,
  })
  async remove(@Param('id') id: Uuid): Promise<void> {
    await this.stagesService.remove(id);
  }
}

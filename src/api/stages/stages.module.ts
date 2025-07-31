import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StagesEntity } from './entities/stage.entity';
import { StagesController } from './stages.controller';
import { StagesService } from './stages.service';

@Module({
  imports: [TypeOrmModule.forFeature([StagesEntity])],
  controllers: [StagesController],
  providers: [StagesService],
})
export class StagesModule {}

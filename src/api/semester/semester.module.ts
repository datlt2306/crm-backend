import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SemesterService } from './semester.service';
import { SemesterController } from './semester.controller';
import { SemesterEntity } from './entities/semester.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SemesterEntity])],
  controllers: [SemesterController],
  providers: [SemesterService],
  exports: [SemesterService],
})
export class SemesterModule {}

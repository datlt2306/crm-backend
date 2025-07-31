import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { ActivityFeedbackEntity } from './entities/activity-feedback.entity';
import { ActivityFileEntity } from './entities/activity-file.entity';
import { ActivityParticipantEntity } from './entities/activity-participant.entity';
import { ActivityEntity } from './entities/activity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ActivityEntity,
      ActivityFileEntity,
      ActivityParticipantEntity,
      ActivityFeedbackEntity,
    ]),
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
})
export class ActivitiesModule {}

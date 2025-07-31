import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserMiddleware } from './common/middleware/user.middleware';
import generateModulesSet from './utils/modules-set';

@Module({
  imports: generateModulesSet(),
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('*');
  }
}

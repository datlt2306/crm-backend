import {
  ClassSerializerInterceptor,
  HttpStatus,
  RequestMethod,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { join } from 'path';
import { AuthService } from './api/auth/auth.service';
import { UserService } from './api/users/user.service';
import { AppModule } from './app.module';
import { type AllConfigType } from './config/config.type';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { AuthGuard } from './guards/auth.guard';
import { AuditInterceptor } from './interceptors/audit.interceptor';
import setupSwagger from './utils/setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  // Set trust proxy to true for rate limiting to work correctly with reverse proxies
  app.set('trust proxy', 1);

  app.useLogger(app.get(Logger));

  // Setup security headers
  app.use(helmet());

  // For high-traffic websites in production, it is strongly recommended to offload compression from the application server - typically in a reverse proxy (e.g., Nginx). In that case, you should not use compression middleware.
  app.use(compression());

  // Parse cookies
  app.use(cookieParser());

  // Rate limiting middleware
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });

  const configService = app.get(ConfigService<AllConfigType>);
  const reflector = app.get(Reflector);
  const corsOrigin = configService.getOrThrow('app.corsOrigin', {
    infer: true,
  });

  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  });
  console.info('CORS Origin:', corsOrigin);

  // Use global prefix if you don't have subdomain
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: [
        { method: RequestMethod.GET, path: '/' },
        { method: RequestMethod.GET, path: 'health' },
      ],
    },
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalGuards(
    new AuthGuard(reflector, app.get(AuthService), app.get(UserService)),
  );
  app.useGlobalFilters(new GlobalExceptionFilter(configService));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException(errors);
      },
    }),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
    new AuditInterceptor(),
  );

  setupSwagger(app);

  await app.listen(configService.getOrThrow('app.port', { infer: true }));

  console.info(
    `Server running on http://localhost:${configService.getOrThrow('app.port', { infer: true })}`,
  );

  return app;
}

void bootstrap();

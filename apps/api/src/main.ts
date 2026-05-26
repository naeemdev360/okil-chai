import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useWebSocketAdapter(new IoAdapter(app));

  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: configService.get<string[]>('app.corsOrigin'),
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(
    new LoggingInterceptor(), // to log the request and response
    new ClassSerializerInterceptor(reflector), // to exclude the fields that are not in the response DTO
    new TransformInterceptor(), // to transform the response to the ApiResponse<TData>
  );

  app.useGlobalFilters(new AllExceptionsFilter()); // to handle all exceptions and return the ApiError

  const appName = configService.getOrThrow<string>('app.name');

  const swaggerConfig = new DocumentBuilder()
    .setTitle(`${appName} API`)
    .setDescription('Lawyer Discovery & Appointment Platform — REST API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('app.port') ?? 3001;
  await app.listen(port);
}

bootstrap();

import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import bkashConfig from './config/bkash.config';
import brandConfig from './config/brand.config';
import databaseConfig from './config/database.config';
import mailerConfig from './config/mailer.config';
import redisConfig from './config/redis.config';
import storageConfig from './config/storage.config';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { VerifiedGuard } from './common/guards/verified.guard';
import { AdminRouteGuard } from './common/guards/admin-route.guard';
import { DatabaseModule } from './database/database.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StorageModule } from './modules/storage/storage.module';
import { LawyersModule } from './modules/lawyers/lawyers.module';
import { AdminModule } from './modules/admin/admin.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

const envFilePath =
  process.env.NODE_ENV === 'production' ? '.env' : '.env.dev';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig, brandConfig, mailerConfig, redisConfig, storageConfig, bkashConfig],
      envFilePath,
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('redis.host', 'localhost'),
          port: config.get<number>('redis.port', 6379),
        },
      }),
    }),
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 60_000, limit: 100 },
      { name: 'authenticated', ttl: 60_000, limit: 1_000 },
    ]),
    DatabaseModule,
    MailerModule,
    AuthModule,
    UsersModule,
    StorageModule,
    LawyersModule,
    AdminModule,
    AppointmentsModule,
    PaymentsModule,
    NotificationsModule,
    ReviewsModule,
    DashboardModule,
  ],
  providers: [
    // Guard execution order: authenticate → enforce admin paths → authorize roles → verify email
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: AdminRouteGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: VerifiedGuard },
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, type JwtModuleOptions } from '@nestjs/jwt';
import { MessagesController } from './messages.controller';
import { MessagesGateway } from './messages.gateway';
import { MessagesRepository } from './messages.repository';
import { MessagesService } from './messages.service';
import { MESSAGES_REPOSITORY, MESSAGES_SERVICE } from './interfaces/messages.interfaces';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.getOrThrow<string>('auth.jwtSecret'),
      }),
    }),
  ],
  controllers: [MessagesController],
  providers: [
    { provide: MESSAGES_REPOSITORY, useClass: MessagesRepository },
    { provide: MESSAGES_SERVICE, useClass: MessagesService },
    MessagesGateway,
  ],
  exports: [MESSAGES_REPOSITORY, MESSAGES_SERVICE],
})
export class MessagesModule {}

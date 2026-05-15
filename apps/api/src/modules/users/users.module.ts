import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { USERS_REPOSITORY, USERS_SERVICE } from './interfaces/users.interfaces';

@Module({
  controllers: [UsersController],
  providers: [
    { provide: USERS_REPOSITORY, useClass: UsersRepository },
    { provide: USERS_SERVICE, useClass: UsersService },
  ],
  exports: [USERS_SERVICE],
})
export class UsersModule {}

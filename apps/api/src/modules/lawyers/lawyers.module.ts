import { Module } from '@nestjs/common';
import { LawyersController } from './lawyers.controller';
import { LawyersService } from './lawyers.service';
import { LawyersRepository } from './lawyers.repository';
import { LAWYERS_REPOSITORY, LAWYERS_SERVICE } from './interfaces/lawyers.interfaces';

@Module({
  controllers: [LawyersController],
  providers: [
    { provide: LAWYERS_REPOSITORY, useClass: LawyersRepository },
    { provide: LAWYERS_SERVICE, useClass: LawyersService },
  ],
  exports: [LAWYERS_SERVICE],
})
export class LawyersModule {}

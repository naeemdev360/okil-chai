import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AdminController } from './admin.controller';
import { AdminRepository } from './admin.repository';
import { AdminService } from './admin.service';
import { ADMIN_REPOSITORY, ADMIN_SERVICE } from './interfaces/admin.interfaces';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminController],
  providers: [
    { provide: ADMIN_REPOSITORY, useClass: AdminRepository },
    { provide: ADMIN_SERVICE, useClass: AdminService },
  ],
})
export class AdminModule {}

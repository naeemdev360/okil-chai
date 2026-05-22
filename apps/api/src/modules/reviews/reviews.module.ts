import { Module } from '@nestjs/common';
import { AppointmentsModule } from '../appointments/appointments.module';
import { ReviewsController } from './reviews.controller';
import { ReviewsRepository } from './reviews.repository';
import { ReviewsService } from './reviews.service';
import { REVIEWS_REPOSITORY, REVIEWS_SERVICE } from './interfaces/reviews.interfaces';

@Module({
  imports: [AppointmentsModule],
  controllers: [ReviewsController],
  providers: [
    { provide: REVIEWS_REPOSITORY, useClass: ReviewsRepository },
    { provide: REVIEWS_SERVICE, useClass: ReviewsService },
  ],
})
export class ReviewsModule {}

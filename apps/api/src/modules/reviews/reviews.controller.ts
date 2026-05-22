import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { PaginatedReviewsResponse, ReviewResponse } from '@repo/shared';
import { Role } from '@repo/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import type { RequestUser } from '../auth/interfaces/auth.interfaces';
import { CreateReviewDto } from './dto/create-review.dto';
import {
  REVIEWS_SERVICE,
  type IReviewsService,
} from './interfaces/reviews.interfaces';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(
    @Inject(REVIEWS_SERVICE) private readonly reviewsService: IReviewsService,
  ) {}

  @Post()
  @Roles(Role.CLIENT)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a review for a completed appointment' })
  @ApiResponse({ status: 201, description: 'Review submitted' })
  @ApiResponse({ status: 400, description: 'Appointment not completed' })
  @ApiResponse({ status: 403, description: 'Not the client on this appointment' })
  @ApiResponse({ status: 409, description: 'Review already submitted for this appointment' })
  submitReview(
    @CurrentUser() user: RequestUser,
    @Body() dto: CreateReviewDto,
  ): Promise<ReviewResponse> {
    return this.reviewsService.submitReview(user.userId, {
      appointmentId: dto.appointmentId,
      rating: dto.rating,
      text: dto.text,
    });
  }

  @Get('lawyer/:lawyerId')
  @Public()
  @ApiOperation({ summary: 'Get paginated reviews for a lawyer' })
  @ApiParam({ name: 'lawyerId', type: String, format: 'uuid' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated lawyer reviews' })
  getLawyerReviews(
    @Param('lawyerId', ParseUUIDPipe) lawyerId: string,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedReviewsResponse> {
    return this.reviewsService.getLawyerReviews(lawyerId, query);
  }
}

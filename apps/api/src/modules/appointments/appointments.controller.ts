import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { AppointmentResponse, AppointmentWithPayment, PaginatedAppointmentsResponse } from '@repo/shared';
import { Role } from '@repo/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { RequestUser } from '../auth/interfaces/auth.interfaces';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ListAppointmentsQueryDto } from './dto/list-appointments-query.dto';
import {
  APPOINTMENTS_SERVICE,
  type IAppointmentsService,
} from './interfaces/appointments.interfaces';

@ApiTags('Appointments')
@ApiBearerAuth()
@Controller('appointments')
@UseGuards(RolesGuard)
export class AppointmentsController {
  constructor(
    @Inject(APPOINTMENTS_SERVICE)
    private readonly appointmentsService: IAppointmentsService,
  ) {}

  @Post()
  @Roles(Role.CLIENT)
  @ApiOperation({ summary: 'Create a new appointment and initiate payment' })
  @ApiResponse({ status: 201, description: 'Appointment created — redirectUrl included when payment is required' })
  @ApiResponse({ status: 400, description: 'Invalid time range or slot in the past' })
  @ApiResponse({ status: 409, description: 'Time slot already booked' })
  createAppointment(
    @CurrentUser() user: RequestUser,
    @Body() dto: CreateAppointmentDto,
  ): Promise<AppointmentWithPayment> {
    return this.appointmentsService.createAppointment(user.userId, {
      lawyerId: dto.lawyerId,
      consultationType: dto.consultationType,
      caseCategory: dto.caseCategory,
      startAt: new Date(dto.startAt),
      endAt: new Date(dto.endAt),
      clientNotes: dto.clientNotes,
    });
  }

  @Get()
  @ApiOperation({ summary: 'List own appointments — clients see their bookings, lawyers see their schedule' })
  @ApiResponse({ status: 200, description: 'Paginated appointment list' })
  listAppointments(
    @CurrentUser() user: RequestUser,
    @Query() query: ListAppointmentsQueryDto,
  ): Promise<PaginatedAppointmentsResponse> {
    return this.appointmentsService.listAppointments(user.userId, user.roles, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment details (only accessible to participants)' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Appointment detail' })
  @ApiResponse({ status: 403, description: 'Not a participant' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  getAppointment(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AppointmentResponse> {
    return this.appointmentsService.getAppointment(user.userId, user.roles, id);
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cancel an appointment (client, lawyer, or admin)' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Appointment cancelled' })
  @ApiResponse({ status: 400, description: 'Appointment not in a cancellable status' })
  @ApiResponse({ status: 403, description: 'Not a participant' })
  cancelAppointment(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.appointmentsService.cancelAppointment(user.userId, user.roles, id);
  }

  @Patch(':id/complete')
  @Roles(Role.LAWYER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Mark appointment as completed (lawyer only)' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Appointment marked as completed' })
  @ApiResponse({ status: 400, description: 'Appointment not in a completable status' })
  @ApiResponse({ status: 403, description: 'Not the assigned lawyer' })
  completeAppointment(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.appointmentsService.completeAppointment(user.userId, id);
  }
}

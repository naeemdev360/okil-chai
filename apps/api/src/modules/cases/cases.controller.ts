import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type {
  CaseDetail,
  CaseDocumentResponse,
  CaseSummary,
  PaginatedCasesResponse,
} from '@repo/shared';
import { Role } from '@repo/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { RequestUser } from '../auth/interfaces/auth.interfaces';
import { AssignLawyerDto } from './dto/assign-lawyer.dto';
import { CreateCaseDto } from './dto/create-case.dto';
import { CreateHearingDto } from './dto/create-hearing.dto';
import { LinkAppointmentDto } from './dto/link-appointment.dto';
import { ListCasesQueryDto } from './dto/list-cases-query.dto';
import { ReleaseAssignmentDto } from './dto/release-assignment.dto';
import { StageTransitionDto } from './dto/stage-transition.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { UpdateHearingDto } from './dto/update-hearing.dto';
import {
  CASES_SERVICE,
  type ICasesService,
} from './interfaces/cases.interfaces';

@ApiTags('Cases')
@ApiBearerAuth()
@Controller('cases')
@UseGuards(RolesGuard)
export class CasesController {
  constructor(
    @Inject(CASES_SERVICE)
    private readonly casesService: ICasesService,
  ) {}

  @Post()
  @ApiOperation({
    summary:
      'Open a new case. Clients open one for themselves; lawyers open one for an existing client (clientUserId required) and are auto-assigned as ACCEPTED.',
  })
  @ApiResponse({ status: 201, description: 'Case created' })
  createCase(
    @CurrentUser() user: RequestUser,
    @Body() dto: CreateCaseDto,
  ): Promise<CaseDetail> {
    return this.casesService.createCase(user.userId, user.roles, {
      title: dto.title,
      description: dto.description ?? null,
      caseCategory: dto.caseCategory,
      assignedLawyerId: dto.assignedLawyerId ?? null,
      appointmentId: dto.appointmentId ?? null,
      clientUserId: dto.clientUserId ?? null,
    });
  }

  @Get()
  @ApiOperation({ summary: 'List my cases — client sees their own, lawyer sees ones they handle or handled' })
  listCases(
    @CurrentUser() user: RequestUser,
    @Query() query: ListCasesQueryDto,
  ): Promise<PaginatedCasesResponse> {
    return this.casesService.listCases(user.userId, user.roles, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a case with full stage history, hearings, documents, linked bookings, and assignment history' })
  @ApiParam({ name: 'id', format: 'uuid' })
  getCase(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) caseId: string,
  ): Promise<CaseDetail> {
    return this.casesService.getCase(user.userId, user.roles, caseId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update editable metadata (title/description for client; referenceNumber/ETA for lawyer)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  updateCase(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) caseId: string,
    @Body() dto: UpdateCaseDto,
  ): Promise<CaseSummary> {
    return this.casesService.updateCase(user.userId, user.roles, caseId, {
      title: dto.title,
      description: dto.description,
      referenceNumber: dto.referenceNumber,
      estimatedCompletionAt:
        dto.estimatedCompletionAt === undefined
          ? undefined
          : dto.estimatedCompletionAt === null
            ? null
            : new Date(dto.estimatedCompletionAt),
    });
  }

  @Post(':id/assign-lawyer')
  @Roles(Role.CLIENT)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Invite a lawyer (idempotent: can be called to swap or replace a pending invite)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  assignLawyer(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) caseId: string,
    @Body() dto: AssignLawyerDto,
  ): Promise<void> {
    return this.casesService.assignLawyer(user.userId, caseId, dto.lawyerId);
  }

  @Post(':id/accept-assignment')
  @Roles(Role.LAWYER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Lawyer accepts a pending assignment — releases any previously accepted lawyer' })
  @ApiParam({ name: 'id', format: 'uuid' })
  acceptAssignment(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) caseId: string,
  ): Promise<void> {
    return this.casesService.acceptAssignment(user.userId, caseId);
  }

  @Post(':id/decline-assignment')
  @Roles(Role.LAWYER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Lawyer declines a pending assignment' })
  @ApiParam({ name: 'id', format: 'uuid' })
  declineAssignment(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) caseId: string,
  ): Promise<void> {
    return this.casesService.declineAssignment(user.userId, caseId);
  }

  @Post(':id/release-assignment')
  @Roles(Role.LAWYER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Current lawyer voluntarily withdraws from the case' })
  @ApiParam({ name: 'id', format: 'uuid' })
  releaseAssignment(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) caseId: string,
    @Body() dto: ReleaseAssignmentDto,
  ): Promise<void> {
    return this.casesService.releaseAssignment(user.userId, caseId, dto.reason ?? null);
  }

  @Post(':id/stage-transitions')
  @Roles(Role.LAWYER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Move the case to a new stage (assigned lawyer only)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  transitionStage(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) caseId: string,
    @Body() dto: StageTransitionDto,
  ): Promise<void> {
    return this.casesService.transitionStage(user.userId, caseId, {
      toStage: dto.toStage,
      note: dto.note ?? null,
    });
  }

  @Post(':id/close')
  @Roles(Role.LAWYER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Close the case (assigned lawyer only)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  closeCase(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) caseId: string,
  ): Promise<void> {
    return this.casesService.closeCase(user.userId, caseId);
  }

  // ── Hearings ───────────────────────────────────────────────────────────────

  @Post(':id/hearings')
  @Roles(Role.LAWYER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Schedule a hearing (assigned lawyer only)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  createHearing(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) caseId: string,
    @Body() dto: CreateHearingDto,
  ): Promise<void> {
    return this.casesService.createHearing(user.userId, caseId, {
      scheduledAt: new Date(dto.scheduledAt),
      venue: dto.venue ?? null,
      hearingType: dto.hearingType,
      notes: dto.notes ?? null,
    });
  }

  @Patch(':id/hearings/:hearingId')
  @Roles(Role.LAWYER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Update a hearing or record its outcome (assigned lawyer only)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiParam({ name: 'hearingId', format: 'uuid' })
  updateHearing(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) caseId: string,
    @Param('hearingId', ParseUUIDPipe) hearingId: string,
    @Body() dto: UpdateHearingDto,
  ): Promise<void> {
    return this.casesService.updateHearing(user.userId, caseId, hearingId, {
      ...(dto.scheduledAt !== undefined && { scheduledAt: new Date(dto.scheduledAt) }),
      ...(dto.venue !== undefined && { venue: dto.venue }),
      ...(dto.hearingType !== undefined && { hearingType: dto.hearingType }),
      ...(dto.notes !== undefined && { notes: dto.notes }),
      ...(dto.outcome !== undefined && { outcome: dto.outcome }),
    });
  }

  @Delete(':id/hearings/:hearingId')
  @Roles(Role.LAWYER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cancel a hearing (assigned lawyer only)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiParam({ name: 'hearingId', format: 'uuid' })
  deleteHearing(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) caseId: string,
    @Param('hearingId', ParseUUIDPipe) hearingId: string,
  ): Promise<void> {
    return this.casesService.deleteHearing(user.userId, caseId, hearingId);
  }

  // ── Documents ──────────────────────────────────────────────────────────────

  @Post(':id/documents')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a document to the case (client or assigned lawyer)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @UseInterceptors(FileInterceptor('file'))
  uploadDocument(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) caseId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CaseDocumentResponse> {
    return this.casesService.uploadDocument(user.userId, user.roles, caseId, { file });
  }

  @Delete(':id/documents/:documentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a document (only the uploader can delete)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiParam({ name: 'documentId', format: 'uuid' })
  deleteDocument(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) caseId: string,
    @Param('documentId', ParseUUIDPipe) documentId: string,
  ): Promise<void> {
    return this.casesService.deleteDocument(user.userId, caseId, documentId);
  }

  // ── Appointment links ──────────────────────────────────────────────────────

  @Post(':id/appointments')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Link an existing appointment to this case' })
  @ApiParam({ name: 'id', format: 'uuid' })
  linkAppointment(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) caseId: string,
    @Body() dto: LinkAppointmentDto,
  ): Promise<void> {
    return this.casesService.linkAppointment(user.userId, user.roles, caseId, dto.appointmentId);
  }

  @Delete(':id/appointments/:appointmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unlink a previously linked appointment' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiParam({ name: 'appointmentId', format: 'uuid' })
  unlinkAppointment(
    @CurrentUser() user: RequestUser,
    @Param('id', ParseUUIDPipe) caseId: string,
    @Param('appointmentId', ParseUUIDPipe) appointmentId: string,
  ): Promise<void> {
    return this.casesService.unlinkAppointment(user.userId, user.roles, caseId, appointmentId);
  }
}

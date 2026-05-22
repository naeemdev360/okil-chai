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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { AvailabilityRuleResponse, LawyerProfileResponse } from '@repo/shared';
import { Role } from '@repo/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { RequestUser } from '../auth/interfaces/auth.interfaces';
import { BatchAvailabilityDto } from './dto/batch-availability.dto';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto';
import { CreateAvailabilityRuleDto } from './dto/create-availability-rule.dto';
import {
  LAWYERS_SERVICE,
  type ILawyersService,
  type OnboardingFiles,
  type UploadedDocument,
} from './interfaces/lawyers.interfaces';

@ApiTags('Lawyers')
@ApiBearerAuth()
@Controller('lawyers')
@Roles(Role.LAWYER)
@UseGuards(RolesGuard)
export class LawyersController {
  constructor(@Inject(LAWYERS_SERVICE) private readonly lawyersService: ILawyersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get the authenticated lawyer profile' })
  @ApiResponse({ status: 200, description: 'Lawyer profile' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  getMyProfile(@CurrentUser() user: RequestUser): Promise<LawyerProfileResponse> {
    return this.lawyersService.getProfile(user.userId);
  }

  @Post('me/onboarding')
  @ApiOperation({
    summary: 'Complete lawyer onboarding',
    description:
      'Multipart form. Send JSON arrays as serialised strings, e.g. consultationTypes=\'["VIDEO"]\'. ' +
      'documentTypes must be parallel to the documents[] files array.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Updated lawyer profile' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profilePhoto', maxCount: 1 },
      { name: 'documents', maxCount: 5 },
    ]),
  )
  async completeOnboarding(
    @CurrentUser() user: RequestUser,
    @Body() dto: CompleteOnboardingDto,
    @UploadedFiles() files: OnboardingFiles,
  ): Promise<LawyerProfileResponse> {
    const uploadedDocs: UploadedDocument[] = (files.documents ?? []).map((file, i) => ({
      file,
      // documentTypes is validated parallel to documents[] — same index is always defined
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      type: (dto.documentTypes ?? [])[i]!,
    }));

    return this.lawyersService.completeOnboarding({
      userId: user.userId,
      dto,
      profilePhoto: files.profilePhoto?.[0],
      documents: uploadedDocs,
    });
  }

  @Patch('me/onboarding/submit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Submit onboarding for admin review',
    description: 'Transitions the lawyer profile from DRAFT to PENDING. Call this on the final wizard step.',
  })
  @ApiResponse({ status: 200, description: 'Profile submitted — verificationStatus is now PENDING' })
  @ApiResponse({ status: 400, description: 'Onboarding already submitted' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  submitOnboarding(@CurrentUser() user: RequestUser): Promise<LawyerProfileResponse> {
    return this.lawyersService.submitOnboarding(user.userId);
  }

  @Delete('me/documents/:documentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a previously uploaded document' })
  @ApiParam({ name: 'documentId', type: String, format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Document deleted' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  deleteDocument(
    @CurrentUser() user: RequestUser,
    @Param('documentId', ParseUUIDPipe) documentId: string,
  ): Promise<void> {
    return this.lawyersService.deleteDocument(user.userId, documentId);
  }

  @Get('me/availability')
  @ApiOperation({ summary: 'List own recurring availability rules' })
  @ApiResponse({ status: 200, description: 'List of availability rules' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  listAvailabilityRules(@CurrentUser() user: RequestUser): Promise<AvailabilityRuleResponse[]> {
    return this.lawyersService.listAvailabilityRules(user.userId);
  }

  @Patch('me/availability')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Replace all recurring availability rules',
    description: 'Deletes existing rules and inserts the provided set atomically. Send an empty array to clear all.',
  })
  @ApiResponse({ status: 200, description: 'Updated availability rules' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  replaceAvailabilityRules(
    @CurrentUser() user: RequestUser,
    @Body() dto: BatchAvailabilityDto,
  ): Promise<AvailabilityRuleResponse[]> {
    return this.lawyersService.replaceAvailabilityRules(user.userId, dto.rules);
  }

  @Post('me/availability')
  @ApiOperation({ summary: 'Create a recurring availability rule' })
  @ApiResponse({ status: 201, description: 'Created availability rule' })
  @ApiResponse({ status: 400, description: 'Invalid input or endTime not after startTime' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  createAvailabilityRule(
    @CurrentUser() user: RequestUser,
    @Body() dto: CreateAvailabilityRuleDto,
  ): Promise<AvailabilityRuleResponse> {
    return this.lawyersService.createAvailabilityRule(user.userId, dto);
  }

  @Delete('me/availability/:ruleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a recurring availability rule' })
  @ApiParam({ name: 'ruleId', type: String, format: 'uuid' })
  @ApiResponse({ status: 204, description: 'Rule deleted' })
  @ApiResponse({ status: 404, description: 'Rule not found' })
  deleteAvailabilityRule(
    @CurrentUser() user: RequestUser,
    @Param('ruleId', ParseUUIDPipe) ruleId: string,
  ): Promise<void> {
    return this.lawyersService.deleteAvailabilityRule(user.userId, ruleId);
  }
}

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
import type { LawyerProfileResponse } from '@repo/shared';
import { Role } from '@repo/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { RequestUser } from '../auth/interfaces/auth.interfaces';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto';
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
}

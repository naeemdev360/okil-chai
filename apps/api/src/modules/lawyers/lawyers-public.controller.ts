import { Controller, Get, Inject, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { AvailabilitySlot, LawyerPublicProfileResponse, PaginatedLawyersResponse } from '@repo/shared';
import { Public } from '../../common/decorators/public.decorator';
import { GetAvailabilityDto } from './dto/get-availability.dto';
import { SearchLawyersDto } from './dto/search-lawyers.dto';
import { LAWYERS_SERVICE, type ILawyersService } from './interfaces/lawyers.interfaces';

const DEFAULT_AVAILABILITY_DAYS = 14;

@ApiTags('Lawyers')
@Controller('lawyers')
@Public()
export class LawyersPublicController {
  constructor(@Inject(LAWYERS_SERVICE) private readonly lawyersService: ILawyersService) {}

  @Get()
  @ApiOperation({ summary: 'Search and filter verified lawyers' })
  @ApiResponse({ status: 200, description: 'Paginated list of lawyers' })
  searchLawyers(@Query() query: SearchLawyersDto): Promise<PaginatedLawyersResponse> {
    return this.lawyersService.searchLawyers(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a verified lawyer public profile' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Lawyer public profile' })
  @ApiResponse({ status: 404, description: 'Lawyer not found' })
  getPublicProfile(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<LawyerPublicProfileResponse> {
    return this.lawyersService.getPublicProfile(id);
  }

  @Get(':id/availability')
  @ApiOperation({ summary: 'Get available time slots for a lawyer within a date range' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiResponse({ status: 200, description: 'List of available slots' })
  @ApiResponse({ status: 404, description: 'Lawyer not found' })
  getAvailability(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: GetAvailabilityDto,
  ): Promise<AvailabilitySlot[]> {
    const today = new Date();
    const from = query.from ?? today.toISOString().slice(0, 10);
    const to =
      query.to ??
      new Date(today.getTime() + DEFAULT_AVAILABILITY_DAYS * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);

    return this.lawyersService.getAvailabilitySlots(id, from, to);
  }
}

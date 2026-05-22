import {
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { FavouriteToggleResponse, PaginatedLawyersResponse } from '@repo/shared';
import { Role } from '@repo/shared';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import type { RequestUser } from '../auth/interfaces/auth.interfaces';
import {
  FAVOURITES_SERVICE,
  type IFavouritesService,
} from './interfaces/favourites.interfaces';

@ApiTags('Favourites')
@ApiBearerAuth()
@Roles(Role.CLIENT)
@UseGuards(RolesGuard)
@Controller('favourites')
export class FavouritesController {
  constructor(
    @Inject(FAVOURITES_SERVICE) private readonly favouritesService: IFavouritesService,
  ) {}

  @Post('lawyers/:lawyerId')
  @ApiOperation({ summary: 'Toggle a lawyer as a favourite (add if not saved, remove if saved)' })
  @ApiParam({ name: 'lawyerId', type: String, format: 'uuid' })
  @ApiResponse({ status: 201, description: 'Favourite toggled' })
  toggleFavourite(
    @CurrentUser() user: RequestUser,
    @Param('lawyerId', ParseUUIDPipe) lawyerId: string,
  ): Promise<FavouriteToggleResponse> {
    return this.favouritesService.toggleFavourite(user.userId, lawyerId);
  }

  @Get('lawyers')
  @ApiOperation({ summary: 'List all saved lawyers for the current client' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated saved lawyers' })
  listFavourites(
    @CurrentUser() user: RequestUser,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedLawyersResponse> {
    return this.favouritesService.listFavourites(user.userId, query);
  }

  @Get('lawyers/:lawyerId/status')
  @ApiOperation({ summary: 'Check if a specific lawyer is saved by the current client' })
  @ApiParam({ name: 'lawyerId', type: String, format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Favourite status' })
  isFavourited(
    @CurrentUser() user: RequestUser,
    @Param('lawyerId', ParseUUIDPipe) lawyerId: string,
  ): Promise<FavouriteToggleResponse> {
    return this.favouritesService.isFavourited(user.userId, lawyerId);
  }
}

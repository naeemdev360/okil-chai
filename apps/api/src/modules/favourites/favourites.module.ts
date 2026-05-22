import { Module } from '@nestjs/common';
import { FavouritesController } from './favourites.controller';
import { FavouritesRepository } from './favourites.repository';
import { FavouritesService } from './favourites.service';
import {
  FAVOURITES_REPOSITORY,
  FAVOURITES_SERVICE,
} from './interfaces/favourites.interfaces';

@Module({
  controllers: [FavouritesController],
  providers: [
    { provide: FAVOURITES_REPOSITORY, useClass: FavouritesRepository },
    { provide: FAVOURITES_SERVICE, useClass: FavouritesService },
  ],
})
export class FavouritesModule {}

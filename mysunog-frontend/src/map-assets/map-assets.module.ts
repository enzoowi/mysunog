import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FireHydrant } from './entities/fire-hydrant.entity';
import { Hotspot } from './entities/hotspot.entity';
import { BfpStation } from './entities/bfp-station.entity';
import { MapAssetsService } from './map-assets.service';
import { MapAssetsController } from './map-assets.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FireHydrant, Hotspot, BfpStation])],
  providers: [MapAssetsService],
  controllers: [MapAssetsController],
  exports: [MapAssetsService],
})
export class MapAssetsModule {}

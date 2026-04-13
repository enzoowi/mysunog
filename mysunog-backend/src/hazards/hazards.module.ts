import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HazardsController } from './hazards.controller';
import { HazardsService } from './hazards.service';
import { HazardReport } from './hazard-report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HazardReport])],
  controllers: [HazardsController],
  providers: [HazardsService],
})
export class HazardsModule {}

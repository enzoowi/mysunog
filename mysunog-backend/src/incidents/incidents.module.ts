import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { FireIncident } from './fire-incident.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FireIncident])],
  controllers: [IncidentsController],
  providers: [IncidentsService],
})
export class IncidentsModule {}

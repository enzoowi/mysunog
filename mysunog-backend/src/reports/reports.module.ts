import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { FireIncident } from '../incidents/fire-incident.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FireIncident])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}

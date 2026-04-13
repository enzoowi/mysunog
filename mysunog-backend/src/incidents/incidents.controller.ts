import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { CreateIncidentDto } from './dto/create-incident.dto';

@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  create(@Body() dto: CreateIncidentDto) {
    return this.incidentsService.create(dto);
  }

  @Get()
  findAll(@Query('barangay') barangay?: string) {
    return this.incidentsService.findAll(barangay);
  }

  @Get('search')
  search(
    @Query('barangay') barangay?: string,
    @Query('cause') cause?: string,
    @Query('propertyType') propertyType?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.incidentsService.search({
      barangay,
      cause,
      propertyType,
      startDate,
      endDate,
    });
  }

  @Get('dashboard-summary')
  getDashboardSummary() {
    return this.incidentsService.getDashboardSummary();
  }

  @Get('response-performance')
  getResponsePerformance() {
    return this.incidentsService.getResponsePerformance();
  }
}

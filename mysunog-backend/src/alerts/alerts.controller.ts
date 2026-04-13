import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';

@Controller('alerts')
export class AlertsController {
  constructor(private alertsService: AlertsService) {}

  @Post()
  create(@Body() dto: CreateAlertDto) {
    return this.alertsService.create(dto);
  }

  @Get()
  findAll() {
    return this.alertsService.findAll();
  }

  @Get('active')
  findActive(@Query('barangay') barangay?: string) {
    return this.alertsService.findActive(barangay);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateAlertDto>) {
    return this.alertsService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alertsService.remove(Number(id));
  }
}

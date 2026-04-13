import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InspectionsService } from './inspections.service';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('inspections')
export class InspectionsController {
  constructor(private inspectionsService: InspectionsService) {}

  @Post()
  create(@Body() dto: CreateInspectionDto, @Req() req: any) {
    return this.inspectionsService.create(dto, { id: req.user.userId } as any);
  }

  @Get('mine')
  mine(@Req() req: any) {
    return this.inspectionsService.listForUser(req.user.userId);
  }

  @Get()
  all() {
    return this.inspectionsService.listAll();
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateInspectionDto) {
    return this.inspectionsService.updateStatus(
      Number(id),
      dto.status,
      dto.adminNotes,
      dto.scheduledDate,
      dto.scheduledTime,
    );
  }
}

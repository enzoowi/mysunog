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
import { PermitsService } from './permits.service';
import { CreatePermitDto } from './dto/create-permit.dto';
import { UpdatePermitStatusDto } from './dto/update-status.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('permits')
export class PermitsController {
  constructor(private permitsService: PermitsService) {}

  // Citizen: create request
  @Post()
  create(@Body() dto: CreatePermitDto, @Req() req: any) {
    return this.permitsService.create(dto, { id: req.user.userId } as any);
  }

  // Citizen: view my requests
  @Get('mine')
  mine(@Req() req: any) {
    return this.permitsService.listForUser(req.user.userId);
  }

  // Admin: view all
  @Get()
  all() {
    return this.permitsService.listAll();
  }

  // Admin: update status
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdatePermitStatusDto) {
    return this.permitsService.updateStatus(
      Number(id),
      dto.status,
      dto.adminRemarks,
    );
  }
}

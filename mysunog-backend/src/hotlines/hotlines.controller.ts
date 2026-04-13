import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { HotlinesService } from './hotlines.service';
import { CreateHotlineDto } from './dto/create-hotline.dto';

@Controller('hotlines')
export class HotlinesController {
  constructor(private hotlinesService: HotlinesService) {}

  @Post()
  create(@Body() dto: CreateHotlineDto) {
    return this.hotlinesService.create(dto);
  }

  @Get()
  findAll() {
    return this.hotlinesService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateHotlineDto>) {
    return this.hotlinesService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hotlinesService.remove(Number(id));
  }
}

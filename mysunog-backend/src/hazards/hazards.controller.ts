import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HazardsService } from './hazards.service';
import { CreateHazardDto } from './dto/create-hazard.dto';
import { UpdateHazardDto } from './dto/update-hazard.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@UseGuards(AuthGuard('jwt'))
@Controller('hazards')
export class HazardsController {
  constructor(private hazardsService: HazardsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 8, {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        const allowedMimes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'video/mp4',
          'video/webm',
          'video/ogg',
          'video/quicktime',
        ];
        if (
          allowedMimes.includes(file.mimetype) ||
          file.mimetype.startsWith('image/')
        )
          cb(null, true);
        else cb(new Error('Only image and video files are allowed'), false);
      },
    }),
  )
  create(
    @Body() dto: CreateHazardDto,
    @Req() req: any,
    @UploadedFiles() files?: any[],
  ) {
    if (files && files.length > 0) {
      const images = files.filter((f) => f.mimetype.startsWith('image/'));
      const videos = files.filter((f) => f.mimetype.startsWith('video/'));
      dto.imageUrls = images.map((f) => `/uploads/${f.filename}`);
      dto.videoUrls = videos.map((f) => `/uploads/${f.filename}`);
    } else {
      dto.imageUrls = [];
      dto.videoUrls = [];
    }
    return this.hazardsService.create(dto, { id: req.user.userId } as any);
  }

  @Get('mine')
  mine(@Req() req: any) {
    return this.hazardsService.findByUser(req.user.userId);
  }

  @Get()
  all() {
    return this.hazardsService.findAll();
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateHazardDto) {
    return this.hazardsService.updateStatus(
      Number(id),
      dto.status,
      dto.adminNotes,
    );
  }
}

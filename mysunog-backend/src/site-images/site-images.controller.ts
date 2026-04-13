import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SiteImagesService } from './site-images.service';

@Controller('site-images')
export class SiteImagesController {
  constructor(private siteImagesService: SiteImagesService) {}

  @Get()
  findAll() {
    return this.siteImagesService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':key')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/site-images',
        filename: (_req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `site-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only image files are allowed'), false);
      },
    }),
  )
  async upload(
    @Param('key') key: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('label') label?: string,
  ) {
    const imageUrl = `/uploads/site-images/${file.filename}`;
    return this.siteImagesService.upsert(key, imageUrl, label);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';

@Controller('education')
export class EducationController {
  constructor(private educationService: EducationService) {}

  @Post()
  create(@Body() dto: CreateEducationDto) {
    return this.educationService.create(dto);
  }

  @Get()
  findAll(@Query('category') category?: string) {
    return this.educationService.findAll(category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.educationService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateEducationDto>) {
    return this.educationService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.educationService.remove(Number(id));
  }

  /** Upload / replace image for an education content item */
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/education',
        filename: (_req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `edu-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only image files are allowed'), false);
      },
    }),
  )
  uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageUrl = `/uploads/education/${file.filename}`;
    return this.educationService.update(Number(id), { imageUrl });
  }
}

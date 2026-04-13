import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteImage } from './site-image.entity';
import { SiteImagesService } from './site-images.service';
import { SiteImagesController } from './site-images.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SiteImage])],
  providers: [SiteImagesService],
  controllers: [SiteImagesController],
  exports: [SiteImagesService],
})
export class SiteImagesModule {}

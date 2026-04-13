import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducationController } from './education.controller';
import { EducationService } from './education.service';
import { EducationContent } from './education.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EducationContent])],
  controllers: [EducationController],
  providers: [EducationService],
})
export class EducationModule {}

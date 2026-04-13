import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotlinesController } from './hotlines.controller';
import { HotlinesService } from './hotlines.service';
import { Hotline } from './hotline.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hotline])],
  controllers: [HotlinesController],
  providers: [HotlinesService],
})
export class HotlinesModule {}

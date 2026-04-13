import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermitsController } from './permits.controller';
import { PermitsService } from './permits.service';
import { PermitRequest } from './permit.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([PermitRequest]), NotificationsModule],
  controllers: [PermitsController],
  providers: [PermitsService],
})
export class PermitsModule {}

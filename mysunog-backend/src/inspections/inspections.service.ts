import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inspection, InspectionStatus } from './inspection.entity';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { User } from '../users/user.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class InspectionsService {
  constructor(
    @InjectRepository(Inspection)
    private repo: Repository<Inspection>,
    private notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateInspectionDto, user: User) {
    const inspection = this.repo.create({
      ...dto,
      requestedBy: user,
      status: InspectionStatus.PENDING,
    });
    return this.repo.save(inspection);
  }

  async listForUser(userId: number) {
    return this.repo.find({
      where: { requestedBy: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async listAll() {
    return this.repo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(
    id: number,
    status: InspectionStatus,
    adminNotes?: string,
    scheduledDate?: string,
    scheduledTime?: string,
  ) {
    const inspection = await this.repo.findOne({
      where: { id },
      relations: ['requestedBy'],
    });

    if (!inspection) {
      throw new NotFoundException('Inspection request not found');
    }

    inspection.status = status;
    if (adminNotes !== undefined) inspection.adminNotes = adminNotes;
    if (scheduledDate !== undefined) inspection.scheduledDate = scheduledDate;
    if (scheduledTime !== undefined) inspection.scheduledTime = scheduledTime;

    const updated = await this.repo.save(inspection);

    await this.notificationsService.createNotification(
      inspection.requestedBy,
      'Inspection Status Updated',
      `Your inspection request for "${inspection.address}" is now "${status}".`,
    );

    return updated;
  }
}

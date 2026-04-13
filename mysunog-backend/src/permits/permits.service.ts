import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermitRequest, PermitStatus } from './permit.entity';
import { CreatePermitDto } from './dto/create-permit.dto';
import { User } from '../users/user.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PermitsService {
  constructor(
    @InjectRepository(PermitRequest)
    private repo: Repository<PermitRequest>,
    private notificationsService: NotificationsService,
  ) {}

  async create(dto: CreatePermitDto, user: User) {
    const permit = this.repo.create({
      ...dto,
      createdBy: user,
      status: PermitStatus.SUBMITTED,
    });

    return this.repo.save(permit);
  }

  async listForUser(userId: number) {
    return this.repo.find({
      where: { createdBy: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async listAll() {
    return this.repo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: number, status: PermitStatus, adminRemarks?: string) {
    const permit = await this.repo.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!permit) {
      throw new NotFoundException('Permit request not found');
    }

    permit.status = status;
    permit.adminRemarks = adminRemarks ?? undefined;

    const updatedPermit = await this.repo.save(permit);

    await this.notificationsService.createNotification(
      permit.createdBy,
      'Permit Status Updated',
      `Your permit request for "${permit.businessName}" is now "${status}".`,
    );

    return updatedPermit;
  }
}

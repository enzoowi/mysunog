import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from './alert.entity';
import { CreateAlertDto } from './dto/create-alert.dto';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private repo: Repository<Alert>,
  ) {}

  async create(dto: CreateAlertDto) {
    const alert = this.repo.create(dto);
    return this.repo.save(alert);
  }

  async findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findActive(barangay?: string) {
    const query = this.repo
      .createQueryBuilder('alert')
      .where('alert.isActive = :isActive', { isActive: true });

    if (barangay) {
      query.andWhere(
        '(alert.targetBarangay IS NULL OR alert.targetBarangay = :barangay)',
        { barangay },
      );
    }

    query.orderBy('alert.createdAt', 'DESC');
    return query.getMany();
  }

  async update(id: number, dto: Partial<CreateAlertDto>) {
    const alert = await this.repo.findOne({ where: { id } });
    if (!alert) throw new NotFoundException('Alert not found');
    Object.assign(alert, dto);
    return this.repo.save(alert);
  }

  async remove(id: number) {
    const alert = await this.repo.findOne({ where: { id } });
    if (!alert) throw new NotFoundException('Alert not found');
    return this.repo.remove(alert);
  }
}

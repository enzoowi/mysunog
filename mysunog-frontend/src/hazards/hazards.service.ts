import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HazardReport, HazardStatus } from './hazard-report.entity';
import { CreateHazardDto } from './dto/create-hazard.dto';
import { User } from '../users/user.entity';

@Injectable()
export class HazardsService {
  constructor(
    @InjectRepository(HazardReport)
    private repo: Repository<HazardReport>,
  ) {}

  async create(dto: CreateHazardDto, user: User) {
    const report = this.repo.create({
      ...dto,
      imageUrls: dto.imageUrls ?? [],
      videoUrls: dto.videoUrls ?? [],
      reportedBy: user,
      status: HazardStatus.PENDING,
    });
    return this.repo.save(report);
  }

  async findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findByUser(userId: number) {
    return this.repo.find({
      where: { reportedBy: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: number, status: HazardStatus, adminNotes?: string) {
    const report = await this.repo.findOne({ where: { id } });
    if (!report) throw new NotFoundException('Hazard report not found');
    report.status = status;
    if (adminNotes !== undefined) report.adminNotes = adminNotes;
    return this.repo.save(report);
  }
}

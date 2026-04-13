import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EducationContent } from './education.entity';
import { CreateEducationDto } from './dto/create-education.dto';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(EducationContent)
    private repo: Repository<EducationContent>,
  ) {}

  async create(dto: CreateEducationDto) {
    const content = this.repo.create(dto);
    return this.repo.save(content);
  }

  async findAll(category?: string) {
    if (category) {
      return this.repo.find({
        where: { category: category as any },
        order: { createdAt: 'DESC' },
      });
    }
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number) {
    const content = await this.repo.findOne({ where: { id } });
    if (!content) throw new NotFoundException('Education content not found');
    return content;
  }

  async update(id: number, dto: Partial<CreateEducationDto>) {
    const content = await this.repo.findOne({ where: { id } });
    if (!content) throw new NotFoundException('Education content not found');
    Object.assign(content, dto);
    return this.repo.save(content);
  }

  async remove(id: number) {
    const content = await this.repo.findOne({ where: { id } });
    if (!content) throw new NotFoundException('Education content not found');
    return this.repo.remove(content);
  }
}

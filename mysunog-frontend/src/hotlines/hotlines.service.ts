import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotline } from './hotline.entity';
import { CreateHotlineDto } from './dto/create-hotline.dto';

@Injectable()
export class HotlinesService {
  constructor(
    @InjectRepository(Hotline)
    private repo: Repository<Hotline>,
  ) {}

  async create(dto: CreateHotlineDto) {
    const hotline = this.repo.create(dto);
    return this.repo.save(hotline);
  }

  async findAll() {
    return this.repo.find({ order: { category: 'ASC', name: 'ASC' } });
  }

  async update(id: number, dto: Partial<CreateHotlineDto>) {
    const hotline = await this.repo.findOne({ where: { id } });
    if (!hotline) throw new NotFoundException('Hotline not found');
    Object.assign(hotline, dto);
    return this.repo.save(hotline);
  }

  async remove(id: number) {
    const hotline = await this.repo.findOne({ where: { id } });
    if (!hotline) throw new NotFoundException('Hotline not found');
    return this.repo.remove(hotline);
  }
}

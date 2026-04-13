import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteImage } from './site-image.entity';

@Injectable()
export class SiteImagesService {
  constructor(
    @InjectRepository(SiteImage)
    private repo: Repository<SiteImage>,
  ) {}

  async findAll(): Promise<SiteImage[]> {
    return this.repo.find({ order: { key: 'ASC' } });
  }

  async findByKey(key: string): Promise<SiteImage | null> {
    return this.repo.findOne({ where: { key } });
  }

  async upsert(
    key: string,
    imageUrl: string,
    label?: string,
  ): Promise<SiteImage> {
    let record = await this.repo.findOne({ where: { key } });
    if (record) {
      record.imageUrl = imageUrl;
      if (label) record.label = label;
    } else {
      record = this.repo.create({ key, imageUrl, label: label ?? key });
    }
    return this.repo.save(record);
  }
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class SiteImage {
  @PrimaryGeneratedColumn()
  id: number;

  /** Unique slot key, e.g. "home_hero", "education_banner" */
  @Column({ unique: true })
  key: string;

  @Column({ nullable: true })
  label?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @UpdateDateColumn()
  updatedAt: Date;
}

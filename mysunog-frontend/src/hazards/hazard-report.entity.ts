import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum HazardType {
  ILLEGAL_WIRING = 'illegal_wiring',
  BLOCKED_EXIT = 'blocked_exit',
  FLAMMABLE_STORAGE = 'flammable_storage',
  OTHER = 'other',
}

export enum HazardStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  RESOLVED = 'resolved',
}

@Entity()
export class HazardReport {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  reportedBy: User;

  @Column('text')
  description: string;

  @Column()
  location: string;

  @Column()
  barangay: string;

  @Column({
    type: 'enum',
    enum: HazardType,
    default: HazardType.OTHER,
  })
  type: HazardType;

  @Column({
    type: 'enum',
    enum: HazardStatus,
    default: HazardStatus.PENDING,
  })
  status: HazardStatus;

  @Column('simple-array', { nullable: true })
  imageUrls?: string[];

  @Column('simple-array', { nullable: true })
  videoUrls?: string[];

  @Column({ nullable: true })
  adminNotes?: string;

  @CreateDateColumn()
  createdAt: Date;
}

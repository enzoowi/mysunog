import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum InspectionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

@Entity()
export class Inspection {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  requestedBy: User;

  @Column()
  address: string;

  @Column()
  barangay: string;

  @Column()
  preferredDate: string;

  @Column()
  preferredTime: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: InspectionStatus,
    default: InspectionStatus.PENDING,
  })
  status: InspectionStatus;

  @Column({ nullable: true })
  adminNotes?: string;

  @Column({ nullable: true })
  scheduledDate?: string;

  @Column({ nullable: true })
  scheduledTime?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

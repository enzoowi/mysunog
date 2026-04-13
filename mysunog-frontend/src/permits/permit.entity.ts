import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum PermitStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  REVISION_REQUIRED = 'revision_required',
  APPROVED = 'approved',
  RELEASED = 'released',
  REJECTED = 'rejected',
}

export enum PermitType {
  FIRE_PERMIT = 'fire_permit',
  FSIC = 'fsic',
}

@Entity()
export class PermitRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  businessName: string;

  @Column()
  businessAddress: string;

  @Column()
  purpose: string;

  @Column({
    type: 'enum',
    enum: PermitType,
    default: PermitType.FIRE_PERMIT,
  })
  permitType: PermitType;

  @Column({
    type: 'enum',
    enum: PermitStatus,
    default: PermitStatus.SUBMITTED,
  })
  status: PermitStatus;

  @Column({ nullable: true })
  adminRemarks?: string;

  @Column({ type: 'date', nullable: true })
  expirationDate?: string;

  @ManyToOne(() => User, { eager: true })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

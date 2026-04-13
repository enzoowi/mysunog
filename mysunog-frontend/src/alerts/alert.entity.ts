import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum AlertType {
  FIRE_RISK = 'fire_risk',
  DRILL = 'drill',
  POWER_OUTAGE = 'power_outage',
  LPG_SAFETY = 'lpg_safety',
  GENERAL = 'general',
}

@Entity()
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column({
    type: 'enum',
    enum: AlertType,
    default: AlertType.GENERAL,
  })
  type: AlertType;

  @Column({ nullable: true })
  targetBarangay?: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

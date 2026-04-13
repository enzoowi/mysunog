import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

export enum RiskLevel {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
}

@Entity()
export class Hotspot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  barangay: string;

  @Column('decimal', { precision: 10, scale: 7 })
  lat: number;

  @Column('decimal', { precision: 10, scale: 7 })
  lng: number;

  @Column({
    type: 'enum',
    enum: RiskLevel,
    default: RiskLevel.MODERATE,
  })
  riskLevel: RiskLevel;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  photoUrl?: string;

  @UpdateDateColumn()
  updatedAt: Date;
}

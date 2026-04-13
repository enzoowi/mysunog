import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class FireIncident {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  incidentDate: string;

  @Column()
  incidentTime: string;

  @Column()
  barangay: string;

  @Column({ nullable: true })
  cause?: string;

  @Column('decimal', { precision: 10, scale: 7 })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 7 })
  longitude: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  estimatedDamage?: number;

  @Column({ nullable: true })
  casualties?: number;

  @Column({ nullable: true })
  injuries?: number;

  @Column({ nullable: true })
  propertyType?: string;

  @Column({ nullable: true })
  remarks?: string;

  // Response performance fields
  @Column({ nullable: true })
  alarmTime?: string;

  @Column({ nullable: true })
  responseTime?: string;

  @Column({ nullable: true })
  controlTime?: string;

  @Column({ nullable: true })
  fireOutTime?: string;

  /** Optional photo URL for map popup display */
  @Column({ nullable: true })
  photoUrl?: string;

  @CreateDateColumn()
  createdAt: Date;
}

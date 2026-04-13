import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity()
export class FireHydrant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 7 })
  lat: number;

  @Column('decimal', { precision: 10, scale: 7 })
  lng: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  photoUrl?: string;

  @UpdateDateColumn()
  updatedAt: Date;
}

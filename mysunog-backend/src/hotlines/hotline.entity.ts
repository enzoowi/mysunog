import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Hotline {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ default: 'general' })
  category: string; // bfp, mdrrmo, barangay, hospital, police, general

  @CreateDateColumn()
  createdAt: Date;
}

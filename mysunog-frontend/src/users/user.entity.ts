import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum UserRole {
  CITIZEN = 'citizen',
  VOLUNTEER = 'volunteer',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CITIZEN,
  })
  role: UserRole;

  @Column({ nullable: true })
  fullName?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  barangay?: string;

  @Column({ default: false })
  isVolunteer: boolean;

  /** Whether the admin has verified this citizen's residency */
  @Column({ default: false })
  isVerified: boolean;

  /** Path to the uploaded government ID for residency verification */
  @Column({ nullable: true })
  residencyProofUrl?: string;

  @CreateDateColumn()
  createdAt: Date;
}

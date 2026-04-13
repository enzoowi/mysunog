import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>) {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async save(user: User) {
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async registerAsVolunteer(
    userId: number,
    data: { fullName: string; phone: string; barangay: string },
  ) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) return null;
    user.fullName = data.fullName;
    user.phone = data.phone;
    user.barangay = data.barangay;
    user.isVolunteer = true;
    return this.usersRepository.save(user);
  }

  async getVolunteers() {
    return this.usersRepository.find({
      where: { isVolunteer: true },
      select: ['id', 'email', 'fullName', 'phone', 'barangay', 'role'],
      order: { fullName: 'ASC' },
    });
  }

  /** Returns users with uploaded IDs awaiting admin approval */
  async findAllPending() {
    return this.usersRepository.find({
      where: { isVerified: false, residencyProofUrl: Not(IsNull()) },
      select: ['id', 'email', 'residencyProofUrl', 'createdAt', 'role'],
      order: { createdAt: 'ASC' },
    });
  }

  /** Admin approves a pending citizen */
  async verifyUser(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) return null;
    user.isVerified = true;
    return this.usersRepository.save(user);
  }
}

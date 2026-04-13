import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, residencyProofUrl?: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      role: UserRole.CITIZEN,
      isVerified: false,
      residencyProofUrl,
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    // Block unverified citizens from logging in
    if (!user.isVerified && user.role === UserRole.CITIZEN) {
      throw new ForbiddenException(
        'Your account is pending admin verification. Please wait for approval.',
      );
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async googleLogin(token: string) {
    return { message: 'Google token login not fully implemented yet.', token };
  }

  /** Browser-based Google OAuth — called after successful OAuth callback */
  async googleOAuthLogin(googleUser: any) {
    if (!googleUser?.email) {
      throw new UnauthorizedException('Google login failed');
    }

    let user = await this.usersService.findByEmail(googleUser.email);

    if (!user) {
      // New Google user — create in pending state (no password, not verified)
      user = await this.usersService.create({
        email: googleUser.email,
        password: '',
        role: UserRole.CITIZEN,
        isVerified: false,
      });
      // Return pending status so the controller can redirect for ID upload
      return { status: 'pending_verification', email: user.email };
    }

    // Existing user who hasn't uploaded their ID yet
    if (!user.isVerified && user.role === UserRole.CITIZEN) {
      if (!user.residencyProofUrl) {
        return { status: 'pending_verification', email: user.email };
      }
      return { status: 'awaiting_approval', email: user.email };
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  /** Complete Google registration — save the uploaded ID path */
  async completeGoogleRegistration(email: string, residencyProofUrl: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');
    user.residencyProofUrl = residencyProofUrl;
    await this.usersService.save(user);
    return {
      message:
        'ID uploaded successfully. Your account is pending admin verification.',
    };
  }
}

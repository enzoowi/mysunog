import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

const idStorage = diskStorage({
  destination: './uploads/ids',
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `id-${uniqueSuffix}${extname(file.originalname)}`);
  },
});

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /** Register with email/password + mandatory government ID file upload */
  @Post('register')
  @UseInterceptors(
    FileInterceptor('idFile', {
      storage: idStorage,
      fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf')
          cb(null, true);
        else cb(new Error('Only image or PDF files are allowed for ID'), false);
      },
    }),
  )
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @UploadedFile() idFile?: Express.Multer.File,
  ) {
    const residencyProofUrl = idFile ? `/uploads/ids/${idFile.filename}` : undefined;
    return this.authService.register(email, password, residencyProofUrl);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  /** Token-based Google login (legacy, keep for compatibility) */
  @Post('google')
  googleLogin(@Body('token') token: string) {
    return this.authService.googleLogin(token);
  }

  /** Browser-based Google OAuth — initiates redirect */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Passport redirects automatically
  }

  /** Google OAuth callback — issues JWT or redirects to ID upload */
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const result = await this.authService.googleOAuthLogin(req.user);

    if (result.status === 'pending_verification') {
      // New Google user — send to ID upload page
      return res.redirect(
        `http://localhost:5173/verify-id?email=${encodeURIComponent(result.email)}`,
      );
    }
    if (result.status === 'awaiting_approval') {
      return res.redirect(
        `http://localhost:5173/login?pending=true`,
      );
    }
    // Verified existing user — issue token
    return res.redirect(
      `http://localhost:5173/login-success?token=${result.access_token}`,
    );
  }

  /** Complete Google registration — accepts uploaded government ID */
  @Post('complete-google-registration')
  @UseInterceptors(
    FileInterceptor('idFile', {
      storage: idStorage,
      fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf')
          cb(null, true);
        else cb(new Error('Only image or PDF files are allowed for ID'), false);
      },
    }),
  )
  async completeGoogleRegistration(
    @Body('email') email: string,
    @UploadedFile() idFile?: Express.Multer.File,
  ) {
    const residencyProofUrl = idFile ? `/uploads/ids/${idFile.filename}` : '';
    return this.authService.completeGoogleRegistration(email, residencyProofUrl);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@Req() req: any) {
    return req.user;
  }
}
import { Body, Controller, Get, Param, Patch, Post, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('volunteer')
  registerAsVolunteer(
    @Req() req: any,
    @Body() body: { fullName: string; phone: string; barangay: string },
  ) {
    return this.usersService.registerAsVolunteer(req.user.userId, body);
  }

  @Get('volunteers')
  getVolunteers() {
    return this.usersService.getVolunteers();
  }

  /** Admin: list pending (unverified) accounts that have uploaded an ID */
  @UseGuards(AuthGuard('jwt'))
  @Get('pending')
  getPendingUsers() {
    return this.usersService.findAllPending();
  }

  /** Admin: approve a pending citizen account */
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/verify')
  verifyUser(@Param('id') id: string) {
    return this.usersService.verifyUser(Number(id));
  }
}


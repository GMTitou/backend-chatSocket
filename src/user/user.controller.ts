import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('search')
  async searchUser(@Query('fullname') fullname: string) {
    return this.userService.findUserByFullName(fullname);
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<any> {
    await this.usersService.updateIsConnected(user.email, true);
    const payload = { email: user.email, sub: user.id };
    console.log('Token générer côté Back: ' + this.jwtService.sign(payload));
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(
    fullname: string,
    email: string,
    password: string,
  ): Promise<any> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      fullname,
      email,
      password: hashedPassword,
    });
    await this.usersService.updateIsConnected(user.email, true);
    return this.login(user);
  }
}

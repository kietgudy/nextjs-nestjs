import { Injectable } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { comparePassword } from '@/helpers/utils';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '@/users/users.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(username);
    const isValid = await comparePassword(pass, user.password);
    if (!user || !isValid) return null;
    return user;
  }

  async login(user: IUser) {
    const payload = { username: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

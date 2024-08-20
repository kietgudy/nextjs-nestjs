import { Injectable } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { comparePassword } from '@/helpers/utils';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '@/users/users.interface';
import { ChangePasswordAuthDto, CheckCodeAuthDto, CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(username);
    if (!user) return null;
    const isValid = await comparePassword(pass, user.password);
    if (!isValid) return null;
    return user;
  }

  async login(user: IUser) {
    const payload = { username: user.email, sub: user._id };
    return {
      user: {
        email: user.email,
        _id: user._id,
        name: user.name
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: CreateAuthDto) {
    return await this.usersService.register(user);
  }
  async checkCode(data: CheckCodeAuthDto) {
    return await this.usersService.handleCheckCode(data);
  }
  async retryActive(data: string) {
    return await this.usersService.handleActive(data);
  }
  async retryPassword(data: string) {
    return await this.usersService.handlePassword(data);
  }
  async changePassword(data: ChangePasswordAuthDto) {
    return await this.usersService.handleChangePassword(data);
  }
}

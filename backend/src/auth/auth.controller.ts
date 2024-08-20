/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public, ResponseMessage } from '@/decorator/customize';
import { ChangePasswordAuthDto, CheckCodeAuthDto, CreateAuthDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage("Login success")
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @Public()
  handleRegister(@Body() registerDto: CreateAuthDto) {
    return this.authService.register(registerDto);
  }
  @Post('check-code')
  @Public()
  checkCode(@Body() registerDto: CheckCodeAuthDto) {
    return this.authService.checkCode(registerDto);
  }
  @Post('retry-active')
  @Public()
  retryActive(@Body("email") email: string) {
    return this.authService.retryActive(email);
  }
  @Post('retry-password')
  @Public()
  retryPassword(@Body("email") email: string) {
    return this.authService.retryPassword(email);
  }
  @Post('change-password')
  @Public()
  changePassword(@Body() data: ChangePasswordAuthDto) {
    return this.authService.changePassword(data);
  }

  @Get('mail')
  @Public()
  checkMail() {
    this.mailerService
      .sendMail({
        to: 'langla76@gmail.com', // list of receivers
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        template: "register",
        context: {
          name: "Kiet",
          activationCode: 999
        }
      })
    return "OK"
  }
}

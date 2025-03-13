import {
  Controller,
  Post,
  UseGuards,
  Get,
  Request,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '@/auth/passport/local-auth.guard';
import { Public } from '@/decorator/customize';
import { CreateAuthDto } from './dto/create-auth.dto';
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
  async handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }
  @Post('register')
  @Public()
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }
  @Get('mail')
  @Public()
  testMail() {
    this.mailerService
      .sendMail({
        to: 'lamngocminh1003@gmail.com', // list of receivers
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome Amie</b>', // HTML body content
      })
      .then(() => {})
      .catch(() => {});
    return 'ok1';
  }
}

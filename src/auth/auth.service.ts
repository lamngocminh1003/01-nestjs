import { Injectable } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { comparePassword } from '@/helpers/util';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto, CodeAuthDto } from './dto/create-auth.dto';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isValidPassword = await comparePassword(pass, user.password);
    if (!isValidPassword) return null;

    return user;
  }
  async login(user: any) {
    const payload = { email: user.email, sub: user._id, username: user.name };
    return {
      user: {
        email: user.email,
        name: user.name,
        _id: user._id,
      },
      access_token: this.jwtService.sign(payload),
    };
  }
  async handleRegister(registerDto: CreateAuthDto) {
    return await this.usersService.handleRegister(registerDto);
  }
  async checkCode(data: CodeAuthDto) {
    return await this.usersService.checkCode(data);
  }
  async retryActive(email: string) {
    return await this.usersService.retryActive(email);
  }
}

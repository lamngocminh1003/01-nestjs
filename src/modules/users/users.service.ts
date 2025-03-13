import { v4 as uuidv4 } from 'uuid';
import { hashPassword } from './../../helpers/util';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import aqp from 'api-query-params';
import { CreateAuthDto } from '@/auth/dto/create-auth.dto';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailerService: MailerService,
  ) {}

  IsEmailExist = async (email: string) => {
    const user = await this.userModel.findOne({
      email,
    });
    if (user) {
      return true;
    } else {
      return false;
    }
  };
  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone, address, image } = createUserDto;
    const isEmailExist = await this.IsEmailExist(email);
    if (isEmailExist) {
      throw new BadRequestException('Email đã tồn tại');
    }
    const hashPasswordUser = await hashPassword(password);
    const user = await this.userModel.create({
      name,
      email,
      password: hashPasswordUser,
      phone,
      address,
      image,
    });
    return { _id: user._id };
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;
    const users = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select('-password')
      .sort(sort as any);
    return { users, totalPages };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }
  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto },
    );
  }

  async remove(id: string) {
    if (mongoose.isValidObjectId(id)) {
      return this.userModel.deleteOne({ _id: id }).exec();
    } else {
      throw new BadRequestException('Id không hợp lệ');
    }
  }
  async handleRegister(registerDto: CreateAuthDto) {
    const { name, email, password } = registerDto;
    const isEmailExist = await this.IsEmailExist(email);
    if (isEmailExist) {
      throw new BadRequestException('Email đã tồn tại');
    }
    const codeId = uuidv4();

    const hashPasswordUser = await hashPassword(password);
    const user = await this.userModel.create({
      name,
      email,
      password: hashPasswordUser,
      isActive: false,
      codeId: codeId,
      codeExpired: dayjs().add(30, 'seconds'), // manipulate
    });
    this.mailerService
      .sendMail({
        to: user.email, // list of receivers
        subject: 'Activate your account at website', // Subject line
        template: 'register',
        context: { name: user.name, activationCode: codeId }, // The `.pug` or `.hbs` extension is appended automatically
      })
      .then(() => {})
      .catch(() => {});
    return { _id: user._id };
  }
}

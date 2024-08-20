/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync } from 'bcrypt';
import aqp from 'api-query-params';
import { CheckCodeAuthDto, CreateAuthDto } from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import * as dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailerService: MailerService,
  ) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };
  async create(createUserDto: CreateUserDto) {
    const { name, email, password, phone, address, image } = createUserDto;
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email ${email} đã tồn tại`);
    }
    const hashPassword = this.getHashPassword(password);
    const newUser = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      phone,
      address,
      image,
    });
    return newUser;
  }

  async register(user: CreateAuthDto) {
    const { name, email, password } = user;
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(`Email ${email} đã tồn tại`);
    }
    const hashPassword = this.getHashPassword(password);
    const codeId = uuidv4();
    const newRegister = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      isActive: false,
      codeId,
      codeExpired: dayjs().add(2, 'minutes'),
    });
    //send mail
    this.mailerService.sendMail({
      to: newRegister.email, // list of receivers
      subject: 'Activate your account', // Subject line
      template: 'register',
      context: {
        name: newRegister?.name ?? newRegister.email,
        activationCode: codeId,
      },
    });
    return newRegister;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select('-password')
      .populate(population)
      .exec();
    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  findOneByEmail(email: string) {
    return this.userModel.findOne({
      email,
    });
  }

  async update(updateUserDto: UpdateUserDto) {
    const updated = await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
      },
    );
    return updated;
  }

  async remove(_id: string) {
    if (!mongoose.Types.ObjectId.isValid(_id)) return 'Not found user';
    return this.userModel.deleteOne({ _id });
  }

  async handleCheckCode(data: CheckCodeAuthDto) {
    const user = await this.userModel.findOne({
      _id: data._id,
      codeId: data.code,
    });
    if (!user) {
      throw new BadGatewayException('Mã code không hợp lệ hoặc đã hết hạn');
    }
    const isBeforeCheck = dayjs().isBefore(user.codeExpired);
    if (isBeforeCheck) {
      await this.userModel.updateOne({ _id: data._id }, { isActive: true });
    } else {
      throw new BadGatewayException('Mã code không hợp lệ hoặc đã hết hạn');
    }
    return isBeforeCheck;
  }
  async handleActive(email: string) {
    const user = await this.userModel.findOne({email})
    if(!user) {
      throw new BadRequestException("Tài khoản không tồn tại")
    }
    const codeId = uuidv4()
    await user.updateOne({
      codeId: codeId,
      codeExpired: dayjs().add(5, 'minutes')
    })
    this.mailerService.sendMail({
      to: user.email, // list of receivers
      subject: 'Activate your account', // Subject line
      template: 'register',
      context: {
        name: user?.name ?? user.email,
        activationCode: codeId,
      },
    });
    return {_id: user._id}
  }
}

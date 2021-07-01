import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import * as Bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { MailerServiceService } from '../mailer-service/mailer-service.service';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly mailerService: MailerServiceService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<[User, Boolean]> {
    let newUser = null;
    let isCreated = true;
    const user = await this.findOne({ email: createUserDto.email });
    if (!user) {
      isCreated = false;
      const user = new User();
      user.email = createUserDto.email;
      user.password = await Bcrypt.hash(createUserDto.password, 0);
      newUser = await user.save();
    }
    return [newUser, isCreated];
  }

  async updateAvatar(fileName: string, user: any): Promise<User> {
    const userUpdate = await this.findOne({ id: user.id });
    userUpdate.avatar = fileName;
    return userUpdate.save();
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    user: any,
  ): Promise<boolean> {
    const { id } = user;
    const userQuery = await this.findOne({ id });
    let isUpdate = false;
    if (userQuery) {
      const isCompare = await Bcrypt.compare(
        changePasswordDto.password,
        userQuery.password,
      );
      if (isCompare) {
        userQuery.password = await Bcrypt.hash(
          changePasswordDto.newPassword,
          0,
        );
        await userQuery.save();
        isUpdate = true;
      }
    }
    return isUpdate;
  }

  async getUserLikeEmail(email: string, user: any): Promise<User[]> {
    return this.userModel.findAll({
      where: {
        id: {
          [Op.not]: user.id,
        },
        email: {
          [Op.like]: `%${email}%`,
        },
      },
      attributes: ['id', 'avatar', 'email'],
    });
  }

  findOne(condition) {
    return this.userModel.findOne({
      where: condition,
      attributes: ['id', 'email', 'password', 'avatar'],
    });
  }

  async resetPassword(email: string): Promise<boolean> {
    let isChangePassword = false;
    const user = await this.findOne({ email });
    if (user) {
      const { email } = user;
      const newPassword = this.randomString(8);
      user.password = await Bcrypt.hash(newPassword, 0);
      await user.save();
      this.mailerService.sendEmail({ email, newPassword });
      isChangePassword = true;
    }
    return isChangePassword;
  }

  private randomString(length) {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

    for (let i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

}

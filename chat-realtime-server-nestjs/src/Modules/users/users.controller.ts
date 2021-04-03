import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Res,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { Request, Response } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtGuards } from '../../auth/guards/jwt.guards';
import { ChangePasswordDto } from './dto/change-password.dto';

const path = require('path');

export const storage = {
  storage: diskStorage({
    destination: './uploads/avatar',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + Date.now();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const [user, isCreated] = await this.usersService.create(createUserDto);
    if (!isCreated) {
      return res.status(201).json(user);
    } else {
      return res.status(409).json({
        email: 'email email is already in used',
      });
    }
  }

  @Get()
  @UseGuards(JwtGuards)
  async findOne(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return res.status(200).json(req.user);
  }

  // @UseGuards(JwtGuards)
  // @Get('n')
  // public getUserInfo(@Res() res: Response) {
  //   return res.status(200).json({ name: 'dung' });
  // }

  @Get('avatar/:filename')
  getFile(@Param('filename') fileName: string, @Res() res: Response) {
    return res.sendFile(fileName, { root: 'uploads/avatar/' });
  }

  @Put('changePassword')
  @UseGuards(JwtGuards)
  public changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request,
  ) {
    return this.usersService.changePassword(changePasswordDto, req.user);
  }

  @Put('upload/avatar')
  @UseInterceptors(FileInterceptor('avatar', storage))
  @UseGuards(JwtGuards)
  uploadAvatar(@UploadedFile() avatar: Express.Multer.File, @Req() req) {
    return this.usersService.updateAvatar(avatar.filename, req.user);
  }

  @Put('forgotpass')
  public async forgotPass(
    @Body() payload: { email: string },
    @Res() res: Response,
  ) {
    console.log(payload);
    const isResetPass = await this.usersService.resetPassword(payload.email);
    if (isResetPass) {
      res.status(200).json({ message: 'password reset was successful' });
    } else {
      res.status(404).json({ message: 'Account does not exist' });
    }
  }

  @Get('get-user-list/:email')
  @UseGuards(JwtGuards)
  public getUserList(@Param('email') email: string, @Req() req: Request) {
    return this.usersService.getUserLikeEmail(email, req.user);
  }
}

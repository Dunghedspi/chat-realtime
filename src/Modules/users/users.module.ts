import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./entities/user.entity";
import { MailerServiceModule } from '../mailer-service/mailer-service.module';

@Module({
  imports:[SequelizeModule.forFeature([User]), MailerServiceModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}

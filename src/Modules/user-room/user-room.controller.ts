import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { UserRoomService } from './user-room.service';
import { CreateUserRoomDto } from './dto/create-user-room.dto';
import { UpdateUserRoomDto } from './dto/update-user-room.dto';
import { JwtGuards } from '../../auth/guards/jwt.guards';
import { Request } from 'express';

@Controller('user-room')
export class UserRoomController {
  constructor(private readonly userRoomService: UserRoomService) {}

  @Post()
  create(@Body() createUserRoomDto: CreateUserRoomDto) {
    return this.userRoomService.create(createUserRoomDto);
  }

  @Get(':offset')
  @UseGuards(JwtGuards)
  findAllWithUser(
    @Param('offset', ParseIntPipe) offset: number,
    @Req() req: Request,
  ) {
    return this.userRoomService.findAll(req.user, offset);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userRoomService.findOne(+id);
  // }
  //
  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateUserRoomDto: UpdateUserRoomDto) {
  //   return this.userRoomService.update(+id, updateUserRoomDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userRoomService.remove(+id);
  // }
}

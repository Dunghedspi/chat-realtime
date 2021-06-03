import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('')
export class AppController {
  @Get('uploads/image/:filename')
  public getImageMessage(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    return res.status(200).sendFile(filename, { root: 'uploads/image' });
  }
  @Get('/')
  public getInitApp() {
    return 'Hello Word';
  }
}

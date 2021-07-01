import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

const path = require('path');
const fs = require('fs');

@Controller('file')
export class FileController {
  constructor() {}

  @Get('dowload/:filename')
  dowload(@Param('filename') filename: string, @Res() res: Response) {
    const fath = path.join('uploads/image', filename);
    if (fs.existsSync(fath)) {
      return res.download(fath);
    } else {
      return res.status(404).json({ message: 'file not found' });
    }
  }
}

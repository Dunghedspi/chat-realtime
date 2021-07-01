import { Injectable } from '@nestjs/common';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import multer, { diskStorage } from 'multer';

@Injectable()
export class MulterConfig implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: function(req, file, cb) {
          cb(null, '/uploads');
        },
        filename: function(req, file, cb) {
          cb(null, file.filename + Date.now());
        },
      }),
      dest: "./uploads/avatar",
    };
  }
}
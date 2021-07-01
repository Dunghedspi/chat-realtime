import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from './configs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseConfig } from './configs/database.config';
import { UsersModule } from './Modules/users/users.module';
import { RoomsModule } from './Modules/rooms/rooms.module';
import { MessageModule } from './WebSockets/message-events/message.module';
import { AuthModule } from './auth/auth.module';
import { UserRoomModule } from './Modules/user-room/user-room.module';
import { MessageModule as MessageModuleResource } from './Modules/message/message.module';
import { AppController } from './app.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerServiceModule } from './Modules/mailer-service/mailer-service.module';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { FileModule } from './Modules/file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as redisStore from 'cache-manager-redis-store';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'build'),
    }),
    CacheModule.register({
      store: redisStore,
      url: process.env.REDIS_URL,
      // host: process.env.REDIS_URL,
      // port: parseInt(process.env.REDIS_PORT),
      ttl: 10000,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.example.com',
          port: 587,
          secure: false,
          auth: {
            user: 'yenbong2912@gmail.com',
            pass: 'vandungsoict2912',
          },
        },
        template: {
          dir: process.cwd() + '/templates/',
          adapter: new EjsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseConfig,
    }),
    UsersModule,
    RoomsModule,
    MessageModule,
    AuthModule,
    UserRoomModule,
    MessageModuleResource,
    MailerServiceModule,
    FileModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

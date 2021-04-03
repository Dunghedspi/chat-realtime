import { Module } from '@nestjs/common';
import { MailerServiceService } from './mailer-service.service';
import { MailerModule as Mailer } from '@nestjs-modules/mailer';

@Module({
  imports: [Mailer],
  providers: [MailerServiceService],
  exports: [MailerServiceService],
})
export class MailerServiceModule {
}

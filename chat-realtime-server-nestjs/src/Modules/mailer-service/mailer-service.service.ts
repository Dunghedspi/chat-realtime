import { Injectable } from '@nestjs/common';
import { MailerService as MailerModule } from '@nestjs-modules/mailer';

@Injectable()
export class MailerServiceService {
  constructor(private readonly mailerService: MailerModule) {
  }

  public sendEmail({ email, newPassword }) {
    this
      .mailerService
      .sendMail({
        to: 'yenbong2912@gmail.com',
        from: email,
        subject: 'Reset Password ✔',
        text: `Your new password is${newPassword}`,
        // template: 'resetpassword',
        // context: {
        //   email: email,
        //   new_password: newPassword,
        // },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

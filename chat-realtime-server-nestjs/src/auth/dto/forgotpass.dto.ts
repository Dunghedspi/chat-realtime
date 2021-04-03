import { IsEmail } from 'class-validator';

export class ForgotpassDto {
  @IsEmail()
  email: string;
}
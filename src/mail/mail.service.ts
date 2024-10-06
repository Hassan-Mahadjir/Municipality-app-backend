import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('GOOGLE_MAIL_USER'),
        pass: this.configService.get('GOOGLE_MAIL_PASSWORD'),
      },
    });
  }

  async sendPasswordResetEmail(to: string, resetCode: string) {
    const mailOptions = {
      from: this.configService.get('GOOGLE_MAIL_USER'),
      to: to,
      subject: 'Verfication Code',
      html: `<p>This is your code<br><strong>${resetCode}</strong></p>`,
    };
    // console.log(this.configService.get('GOOGLE_MAIL_PASSWORD'));
    await this.transporter.sendMail(mailOptions);
  }
}

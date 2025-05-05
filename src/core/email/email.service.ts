import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendVerificationEmail(to: string, token: string) {
    const url = `${process.env.CLIENT_URL}/verify/${token}`;
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Подтверждение регистрации',
      html: `<p>Нажмите <a href="${url}">здесь</a>, чтобы подтвердить email.</p>`,
    });
  }
}

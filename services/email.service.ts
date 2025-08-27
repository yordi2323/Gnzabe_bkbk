import { Request } from 'express';
import * as brevo from '@getbrevo/brevo';
import { removeLastPathSegment } from '../utilities/helper';
import { emailQueue } from './queues/emailQueues.service';

export class EmailSender {
  subject: string;
  htmlContent: string;
  sender: { email: string; name?: string };
  to: { email: string; name?: string }[];
  apiInstance: brevo.TransactionalEmailsApi;
  sendSmtpEmail: brevo.SendSmtpEmail;

  constructor({
    subject = '',
    htmlContent,
    sender,
    to,
  }: {
    subject: string;
    htmlContent: string;
    sender: { email: string; name?: string };
    to: { email: string; name?: string }[];
  }) {
    this.subject = subject;
    this.htmlContent = htmlContent;
    this.sender = sender;
    this.to = to;
    this.apiInstance = new brevo.TransactionalEmailsApi();
    this.sendSmtpEmail = new brevo.SendSmtpEmail();
    this.setApiKey();
  }

  setApiKey() {
    this.apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY!,
    );
  }

  async send() {
    this.sendSmtpEmail.subject = this.subject;
    this.sendSmtpEmail.htmlContent = this.htmlContent;
    this.sendSmtpEmail.sender = {
      email: this.sender.email,
      name: this.sender.name,
    };
    this.sendSmtpEmail.to = this.to.map((recipient) => ({
      email: recipient.email,
      name: recipient.name,
    }));

    const data = await this.apiInstance.sendTransacEmail(this.sendSmtpEmail);
    return data;
  }
}

export const queueVerificationEmail = async (
  req: Request,
  email: string,
  id: string,
  token: string,
  name?: string,
): Promise<void> => {
  const protocol = req.protocol; // 'http' or 'https'
  const host = req.get('host'); // 'localhost:3000' or 'yourdomain.com'
  const baseUrl = `${protocol}://${host}${removeLastPathSegment(req.originalUrl)}`;
  const verificationUrl = `${baseUrl}/verify?token=${token}&id=${id}`;
  console.log(verificationUrl, 'verificationUrl');
  await emailQueue.add('sendVerificationEmail', {
    type: 'verify',
    to: {
      email,
      name,
    },
    url: verificationUrl,
  });
};

export const queueInivationEmail = async (
  link: string,
  email: string,
  name: string,
  companyName: string,
) => {
  await emailQueue.add('sendInvitationEmail', {
    type: 'sendInvitation',
    companyName,
    to: {
      email,
      name,
    },
    url: link,
  });
};

export const queuePasswordResetEmail = async (
  req: Request,
  email: string,
  id: string,
  token: string,
  name?: string,
): Promise<void> => {
  //
  console.log(req.originalUrl.includes('company'), 'originalUrl');
  let resetUrl;
  if (req.originalUrl.includes('company'))
    resetUrl = `${req.protocol}://prod.gnzabe.com/company/reset-password?token=${token}&id=${id}`;
  else if (req.originalUrl.includes('user'))
    resetUrl = `${req.protocol}://prod.gnzabe.com/user/reset-password?token=${token}&id=${id}`;
  else
    resetUrl = `${req.protocol}://prod.gnzabe.com/platform-owner/reset-password?token=${token}&id=${id}`;
  // const resetFrontendUrl = `${process.env.PASSWORD_RESET_FRONTEND_URL}?token=${token}&id=${id}`;
  console.log(resetUrl, 'resetUrl');
  await emailQueue.add('sendPasswordResetEmail', {
    type: 'reset',
    email,
    id,
    token,
    name,
    url: resetUrl,
    to: {
      email,
      name,
    },
  });
};

export const queueOtpEmail = async (
  email: string,
  otp: string,
  name?: string,
): Promise<void> => {
  await emailQueue.add('sendOtpEmail', {
    type: 'otp',
    to: {
      email,
      name,
    },
    otp,
  });
};

export const queueApprovalRequestEmail = async (
  departmentAdminName: string,
  departmentAdminEmail: string,
  employeeEmail: string,
  employeeName: string,
) => {
  await emailQueue.add('sendApprovalRequestEmail', {
    type: 'approval',
    departmentAdminName,
    employeeEmail,
    employeeName,
    to: {
      email: departmentAdminEmail,
    },
  });
};

// hwo
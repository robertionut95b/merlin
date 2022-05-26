import { MailService } from "@sendgrid/mail";
import type { UserWithRole } from "../auth/auth.server";

type SendEmailOptions<User> = {
  emailAddress: string;
  magicLink?: string;
  user?: User | null;
  domainUrl?: string;
  form?: FormData;
};

interface EmailSender<User> {
  sendEmail(
    options: SendEmailOptions<User>,
    subject: string,
    body: string
  ): Promise<void>;
}

let smtp: SMTPProvider;

declare global {
  var __smtp__: SMTPProvider;
}

class SMTPProvider implements EmailSender<UserWithRole> {
  API_KEY: string;
  mail: MailService | undefined;

  constructor() {
    this.API_KEY = process.env.SMTP_MAIL_API_KEY || "";
    if (
      this.API_KEY === undefined ||
      this.API_KEY === null ||
      this.API_KEY === ""
    ) {
      throw new Error("SMTP_MAIL_API_KEY is not defined");
    }
    this.setupSMTPinstance();
  }

  async sendEmail(
    { emailAddress }: SendEmailOptions<UserWithRole>,
    subject: string,
    body: string
  ): Promise<void> {
    try {
      console.log("Sending email to: ", emailAddress);
      await this.mail?.send({
        to: emailAddress,
        from: "Merlin-NoReply@merlin-app.org",
        subject,
        html: body,
      });
    } catch (error) {
      console.error(error);
      throw new Error(`Error sending email: ${error}`);
    }

    console.log(`Email sent to ${emailAddress}`);

    return Promise.resolve();
  }

  private setupSMTPinstance() {
    this.mail = new MailService();
    this.mail.setApiKey(this.API_KEY);
  }
}

const initializeSMTPClient = () => {
  console.log(`📧 Setting up SMTP client`);
  return new SMTPProvider();
};

if (process.env.NODE_ENV === "production") {
  smtp = initializeSMTPClient();
} else {
  if (!global.__smtp__) {
    global.__smtp__ = initializeSMTPClient();
  }
  smtp = global.__smtp__;
}

export { smtp };

import { MailOptionsDto } from "../../domain/models/MailOptionsDto";
import { MailerService } from "../../domain/services/MailerService";

export class MailerServiceFake implements MailerService {

  async sendEmail(mailOptions: MailOptionsDto) {
  }

}
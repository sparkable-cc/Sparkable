import { MailOptionsDto } from "../models/MailOptionsDto";

export interface MailerService {
    sendEmail: (mailOptions: MailOptionsDto) => void,
}
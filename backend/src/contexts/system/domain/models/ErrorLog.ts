import { MandatoryFieldEmptyException } from "../../../_shared/domain/exceptions/MandatoryFieldEmptyException";
import { ErrorLogDto } from "./dtos/ErrorLogDto";

export class ErrorLog {
  private message: string;
  private url: string;
  private userUuid: string;

  constructor(error: any) {
    if (!error.message || !error.url) {
      throw new MandatoryFieldEmptyException();
    }

    this.message = error.message;
    this.url = error.url;
    this.userUuid = error.userUuid;
  }

  public toDto(): ErrorLogDto {
    return {
      message: this.message,
      url: this.url,
      userUuid: this.userUuid
    };
  }

}
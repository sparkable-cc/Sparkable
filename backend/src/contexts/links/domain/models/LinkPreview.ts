import { MandatoryFieldEmptyException } from "../../../_shared/domain/exceptions/MandatoryFieldEmptyException";
import { UrlWithoutHttpsRestrictionException } from "../exceptions/UrlWithoutHttpsRestrictionException";
import { LinkPreviewDto } from "./dtos/LinkPreviewDto";

export class LinkPreview {
  private url: string;

  constructor(url: string) {
    if (!url) {
      throw new MandatoryFieldEmptyException();
    }

    if (!url.startsWith('https://')) {
      throw new UrlWithoutHttpsRestrictionException();
    }

    this.url = url;
  }

  public toDto(): LinkPreviewDto {
    return {
      url: this.url
    };
  }

}
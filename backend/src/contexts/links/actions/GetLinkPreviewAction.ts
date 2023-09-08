import { LinkPreview } from "../domain/models/LinkPreview";
import { ScraperService } from "../domain/services/ScraperService";

export class GetLinkPreviewAction {
  private scraperService;

  constructor(scraperService:ScraperService) {
    this.scraperService = scraperService;
  }

  async execute(url:string) {
    const linkPreview = new LinkPreview(url);
    return await this.scraperService.execute(linkPreview.toDto().url);
  }

}
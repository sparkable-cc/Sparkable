import { ScraperService } from "../../domain/services/ScraperService";
import ogs from 'ts-open-graph-scraper';

export class ScraperServiceOgs implements ScraperService {

  execute(url:string): Promise<any> {
    return ogs(url);
  }

}

export interface ScraperService {
  execute: (url:string) => Promise<any>,
}
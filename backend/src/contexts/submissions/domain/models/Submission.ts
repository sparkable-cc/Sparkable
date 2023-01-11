export class Submission {
  private id: string;
  private link: string;
  private category: string;
  private description: string;
  private author: string;
  private date: Date;

  constructor(
    id: string,
    link: string,
    category: string,
    description: string,
    author: string,
    date: Date,
  ) {
    this.id = id;
    this.link = link;
    this.category = category;
    this.description = description;
    this.author = author;
    this.date = date;
  }

  public get getLink(): string {
    return this.link;
  }

  public get getCategory(): string {
    return this.category;
  }

  public get getDescription(): string {
    return this.description;
  }

  public get getAuthor(): string {
    return this.author;
  }

  public get getDate(): Date {
    return this.date;
  }
}

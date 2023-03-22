import { LinkDto } from "../../../links/domain/models/LinkDto";

export interface VoteDto {
  userUuid:string;
  cycle:number;
  votes:Array<LinkDto>;
  count:number;
}
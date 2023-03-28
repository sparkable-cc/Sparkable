export interface VotingDto {
  userUuid:string;
  cycle:number;
  votes:Array<string>;
  count:number;
}
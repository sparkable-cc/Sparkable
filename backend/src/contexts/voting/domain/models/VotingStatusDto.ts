export interface VotingStatusDto {
  openVoting:boolean;
  cycle:number;
  nextOpenVotingDate:string;
  daysUntilNextVoting:number;
  timeUntilNextVoting:string;
}
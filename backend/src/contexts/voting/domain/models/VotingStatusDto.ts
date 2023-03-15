export interface VotingStatusDto {
  openVoting:boolean;
  round:number;
  nextOpenVotingDate:string;
  daysUntilNextVoting:number;
  timeUntilNextVoting:string;
}
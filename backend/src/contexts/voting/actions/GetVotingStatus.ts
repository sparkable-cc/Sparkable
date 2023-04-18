import { CycleDto } from "../domain/models/CycleDto";
import { VotingStatusDto } from "../domain/models/VotingStatusDto";
import { VotingRepository } from "../domain/repositories/VotingRepository";
import { GetCurrentCycleService } from "../domain/services/GetCurrentCycleService";

export class GetVotingStatusAction {
  votingRepository: VotingRepository;

  constructor(
    votingRepository: VotingRepository
  ) {
    this.votingRepository = votingRepository;
  }

  async execute(userUuid?:string): Promise<VotingStatusDto> {
    const currentDate = new Date();

    console.log(currentDate);

    const currentCycle = GetCurrentCycleService.execute(currentDate);

    console.log(currentCycle);

    const nextOpenVotingDate = new Date(currentCycle.openVotingDate);

    console.log(await this.userHasVoted(userUuid, currentCycle));

    if (currentDate >= nextOpenVotingDate) {
      return {
        openVoting: true,
        cycle: currentCycle.cycle,
        nextOpenVotingDate: '',
        daysUntilNextVoting: 0,
        timeUntilNextVoting: '',
        userHasVoted: await this.userHasVoted(userUuid, currentCycle)
      }
    } else {
      const diff = this.getDateDiff(nextOpenVotingDate, currentDate);

      return {
        openVoting: false,
        cycle: currentCycle.cycle,
        nextOpenVotingDate: nextOpenVotingDate.toISOString(),
        daysUntilNextVoting: this.getDayDiff(diff),
        timeUntilNextVoting: this.getTimeDiff(diff),
        userHasVoted: false
      }
    }
  }

  private async userHasVoted(userUuid: string | undefined, currentCycle: CycleDto) {
    let userHasVoted = false;
    if (userUuid) {

      console.log(await this.votingRepository.findVoting({
        userUuid: userUuid,
        cycle: currentCycle.cycle
      }));

      const hasVotedThisCycle = await this.votingRepository.findVoting({
        userUuid: userUuid,
        cycle: currentCycle.cycle
      });

      if (hasVotedThisCycle)
        userHasVoted = true;
    }
    return userHasVoted;
  }

  private getDateDiff(endDate: Date, startDate: Date): number {
    return endDate.getTime() - startDate.getTime();
  }

  private getDayDiff(diff: number): number {
    const msInDay = 24 * 60 * 60 * 1000;

    return Math.round(Math.abs(diff) / msInDay);
  }

  private getTimeDiff(diff: number): string {
    let seconds = Math.floor(diff / 1000);
    let minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    return `${this.padTo2Digits(hours)}:${this.padTo2Digits(minutes)}:${this.padTo2Digits(seconds,)}`;
  }

  private padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

}
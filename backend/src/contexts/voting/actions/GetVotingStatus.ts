import { DateNotValidException } from "../domain/exceptions/DateNotValidException";
import { DateOutsideCycleException } from "../domain/exceptions/DateOutsideCycleException";
import { CycleDto } from "../domain/models/CycleDto";
import { VotingStatusDto } from "../domain/models/VotingStatusDto";
import cycleCollection from "../infrastructure/persistence/VotingCycles.json";

export class GetVotingStatusAction {

  async execute(currentDate: Date): Promise<VotingStatusDto> {
    if (currentDate.toString() === 'Invalid Date' ) {
      throw new DateNotValidException();
    }

    const currentCycle = this.getCurrentCycle(cycleCollection, currentDate);
    const nextOpenVotingDate = new Date(currentCycle.openVotingDate);

    if (currentDate >= nextOpenVotingDate) {
      return {
        openVoting: true,
        cycle: currentCycle.cycle,
        nextOpenVotingDate: '',
        daysUntilNextVoting: 0,
        timeUntilNextVoting: ''
      }
    } else {
      const diff = this.getDateDiff(nextOpenVotingDate, currentDate);

      return {
        openVoting: false,
        cycle: currentCycle.cycle,
        nextOpenVotingDate: nextOpenVotingDate.toISOString(),
        daysUntilNextVoting: this.getDayDiff(diff),
        timeUntilNextVoting: this.getTimeDiff(diff)
      }
    }
  }

  private getCurrentCycle(cycleCollection: CycleDto[], currentDate: Date): CycleDto {
    let currentCycle = {
      cycle: 0,
      openVotingDate: '',
      start: '',
      end: ''
    };

    cycleCollection.some(cycle => {
      if (currentDate >= new Date(cycle.start) && currentDate <= new Date(cycle.end)) {
        currentCycle = cycle;
        return;
      }
    });

    if (!currentCycle.start) {
      throw new DateOutsideCycleException();
    }

    return currentCycle;
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
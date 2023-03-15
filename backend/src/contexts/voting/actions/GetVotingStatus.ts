import { DateNotValidException } from "../domain/exceptions/DateNotValidException";
import { VotingStatusDto } from "../domain/models/VotingStatusDto";
import roundCollection from "../infrastructure/persistence/VotingRounds.json";

export class GetVotingStatusAction {

  async execute(currentDate: Date): Promise<VotingStatusDto> {
    const currentRound = this.getCurrentRound(roundCollection, currentDate);
    const nextOpenVotingDate = new Date(currentRound.openVotingDate);

    if (currentDate >= nextOpenVotingDate) {
      return {
        openVoting: true,
        round: currentRound.round,
        nextOpenVotingDate: '',
        daysUntilNextVoting: 0,
        timeUntilNextVoting: ''
      }
    } else {
      const diff = this.getDateDiff(nextOpenVotingDate, currentDate);

      return {
        openVoting: false,
        round: currentRound.round,
        nextOpenVotingDate: nextOpenVotingDate.toISOString(),
        daysUntilNextVoting: this.getDayDiff(diff),
        timeUntilNextVoting: this.getTimeDiff(diff)
      }
    }
  }

  private getCurrentRound(roundCollection: { round: number; openVotingDate: string; start: string; end: string; }[], currentDate: Date) {
    let currentRound = {
      round: 0,
      openVotingDate: '',
      start: '',
      end: ''
    };

    roundCollection.some(round => {
      if (currentDate >= new Date(round.start) && currentDate <= new Date(round.end)) {
        currentRound = round;
        return;
      }
    });

    if (!currentRound.start) {
      throw new DateNotValidException();
    }

    return currentRound;
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
import { CycleDto } from "../models/CycleDto";
import cycleCollection from "../../infrastructure/persistence/votingCycles.json";
import { DateOutsideCycleException } from "../exceptions/DateOutsideCycleException";

export class GetCurrentCycleService {

  static execute(currentDate: Date = new Date()):CycleDto {
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

}

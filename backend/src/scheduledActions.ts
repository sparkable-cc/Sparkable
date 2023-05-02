import cron, { ScheduleOptions } from 'node-cron';
import { LinkRepositoryPG } from './contexts/links/infrastructure/persistence/repositories/LinkRepositoryPG';
import { IncreaseStageOnLinksAction } from './contexts/stages/actions/IncreaseStageOnLinksAction';
import { NoVotesOnThisCycleException } from './contexts/stages/domain/exceptions/NoVotesOnThisCycleException';
import { DateOutsideCycleException } from './contexts/voting/domain/exceptions/DateOutsideCycleException';
import { VoteRepositoryPG } from './contexts/voting/infrastructure/persistence/repositories/VoteRepositoryPG';
import dataSource from './data-source';

const scheduleOptions: ScheduleOptions = {
  scheduled: false
};

const scheduleAction = async () => {
  const increaseStageOnLinksAction = new IncreaseStageOnLinksAction(
    new VoteRepositoryPG(dataSource),
    new LinkRepositoryPG(dataSource)
  );

  console.log(`Increase stage on links action job`);
  await increaseStageOnLinksAction.execute()
  .then((total) => {
    console.log(`Total links updated: ${total}`);
  })
  .catch((error) => {
    switch (error.constructor) {
      case NoVotesOnThisCycleException:
        console.log(`Total links updated: 0`);
        break;
      case DateOutsideCycleException:
        console.log(`Date outside the cycle`);
        break;
      default:
        console.log(
          'Failed to do something async with an unspecified error: ',
          error,
        );
    }
  });
};

//At 04:00 on Monday
var scheduledActions = cron.schedule('0 4 * * 1', scheduleAction, scheduleOptions);

export { scheduledActions };
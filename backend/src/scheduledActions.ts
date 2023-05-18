import cron, { ScheduleOptions } from 'node-cron';
import { LinkRepositoryPG } from './contexts/links/infrastructure/persistence/repositories/LinkRepositoryPG';
import { IncreaseStageOnLinksAndUsersAction } from './contexts/stages/actions/IncreaseStageOnLinksAndUsersAction';
import { NoVotesOnThisCycleException } from './contexts/stages/domain/exceptions/NoVotesOnThisCycleException';
import { StageMovementRepositoryPG } from './contexts/stages/infrastructure/persistence/repositories/StageMovementsLinksRepositoryPG';
import { DateOutsideCycleException } from './contexts/voting/domain/exceptions/DateOutsideCycleException';
import { VoteRepositoryPG } from './contexts/voting/infrastructure/persistence/repositories/VoteRepositoryPG';
import dataSource from './data-source';
import { UserRepositoryPG } from './contexts/users/infrastructure/persistence/repositories/UserRepositoryPG';

const scheduleOptions: ScheduleOptions = {
  scheduled: false
};

const increaseStageOnLinksAction = async () => {
  const increaseStageOnLinksAction = new IncreaseStageOnLinksAndUsersAction(
    new VoteRepositoryPG(dataSource),
    new LinkRepositoryPG(dataSource),
    new UserRepositoryPG(dataSource),
    new StageMovementRepositoryPG(dataSource)
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
var scheduledActions = cron.schedule('0 4 * * 1', increaseStageOnLinksAction, scheduleOptions);

export { scheduledActions };
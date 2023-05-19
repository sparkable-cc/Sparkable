import cron, { ScheduleOptions } from 'node-cron';
import { LinkRepositoryPG } from './contexts/links/infrastructure/persistence/repositories/LinkRepositoryPG';
import { IncreaseStageOnLinksAndUsersAction } from './contexts/stages/actions/IncreaseStageOnLinksAndUsersAction';
import { NoVotesOnThisCycleException } from './contexts/stages/domain/exceptions/NoVotesOnThisCycleException';
import { StageMovementRepositoryPG } from './contexts/stages/infrastructure/persistence/repositories/StageMovementsLinksRepositoryPG';
import { DateOutsideCycleException } from './contexts/voting/domain/exceptions/DateOutsideCycleException';
import { VoteRepositoryPG } from './contexts/voting/infrastructure/persistence/repositories/VoteRepositoryPG';
import dataSource from './data-source';
import { UserRepositoryPG } from './contexts/users/infrastructure/persistence/repositories/UserRepositoryPG';
import { StoreStageMovementService } from './contexts/stages/domain/services/StoreStageMovementService';
import { DecreaseStageOnLinksAndUsersAction } from './contexts/stages/actions/DecreaseStageOnLinksAndUsersAction';

const scheduleOptions: ScheduleOptions = {
  scheduled: false
};

const increaseStageOnLinksAction = async () => {
  const stageMovementRepository = new StageMovementRepositoryPG(dataSource);
  const increaseStageOnLinksAction = new IncreaseStageOnLinksAndUsersAction(
    new VoteRepositoryPG(dataSource),
    new LinkRepositoryPG(dataSource),
    new UserRepositoryPG(dataSource),
    stageMovementRepository,
    new StoreStageMovementService(stageMovementRepository)
  );

  console.log(`Increase stage on links action job`);
  await increaseStageOnLinksAction.execute()
  .then(([totalLinks, totalUsers]) => {
    console.log(`Total links increased: ${totalLinks}`);
    console.log(`Total users increased: ${totalUsers}`);
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

const decreaseStageOnLinksAction = async () => {
  const stageMovementRepository = new StageMovementRepositoryPG(dataSource);
  const decreaseStageOnLinksAction = new DecreaseStageOnLinksAndUsersAction(
    new VoteRepositoryPG(dataSource),
    new LinkRepositoryPG(dataSource),
    new UserRepositoryPG(dataSource),
    new StoreStageMovementService(stageMovementRepository)
  );

  console.log(`Decrease stage on links action job`);
  await decreaseStageOnLinksAction.execute()
  .then(([totalLinks, totalUsers]) => {
    console.log(`Total links decreased: ${totalLinks}`);
    console.log(`Total users decreased: ${totalUsers}`);
  })
  .catch((error) => {
    switch (error.constructor) {
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

const scheduledActions: Map<string, cron.ScheduledTask> = new Map();
//At 01:00 on Monday
//const increaseStageOnLinksJob = cron.schedule('0 1 * * 1', increaseStageOnLinksAction, scheduleOptions);
const increaseStageOnLinksJob = cron.schedule('* * * * *', increaseStageOnLinksAction, scheduleOptions);
//At 04:00 on Monday
//const decreaseStageOnLinksJob = cron.schedule('0 4 * * 1', decreaseStageOnLinksAction, scheduleOptions);
const decreaseStageOnLinksJob = cron.schedule('* * * * *', decreaseStageOnLinksAction, scheduleOptions);

scheduledActions.set('increaseStageOnLinksJob',increaseStageOnLinksJob);
scheduledActions.set('decreaseStageOnLinksJob',decreaseStageOnLinksJob);

export { scheduledActions };
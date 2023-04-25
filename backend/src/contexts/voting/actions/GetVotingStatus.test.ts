import { DateOutsideCycleException } from "../domain/exceptions/DateOutsideCycleException";
import { Voting } from "../domain/models/Voting";
import { VotingRepositoryInMemory } from "../infrastructure/persistence/repositories/VotingRepositoryInMemory";
import { GetVotingStatusAction } from "./GetVotingStatus";

describe('Get voting status', () => {
  let getVotingStatusAction: GetVotingStatusAction;
  let votingRepository: VotingRepositoryInMemory;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    votingRepository = new VotingRepositoryInMemory();
    getVotingStatusAction = new GetVotingStatusAction(votingRepository);
  });

  test('Get voting status in an close day', async () => {
    jest.setSystemTime(new Date('Mar 27, 2023 00:00:00'));
    const votingStatus = await getVotingStatusAction.execute();

    expect(votingStatus.openVoting).toBeFalsy();
    expect(votingStatus.cycle).toEqual(1);
    expect(votingStatus.nextOpenVotingDate).toEqual('2023-04-06T00:00:00.000Z');
    expect(votingStatus.daysUntilNextVoting).toEqual(10);
    expect(votingStatus.timeUntilNextVoting).toEqual('240:00:00');
    expect(votingStatus.userHasVoted).toBeFalsy();
  });

  test('Get voting status in an open day', async () => {
    jest.setSystemTime(new Date('Apr 06, 2023 00:00:00'));
    const votingStatus = await getVotingStatusAction.execute();

    expect(votingStatus.openVoting).toBeTruthy();
    expect(votingStatus.cycle).toEqual(1);
    expect(votingStatus.nextOpenVotingDate).toEqual('');
    expect(votingStatus.daysUntilNextVoting).toEqual(0);
    expect(votingStatus.timeUntilNextVoting).toEqual('');
    expect(votingStatus.userHasVoted).toBeFalsy();
  });

  test('Get voting status in an close day from the second cycle', async () => {
    jest.setSystemTime(new Date('Apr 11, 2023 00:00:00'));
    const votingStatus = await getVotingStatusAction.execute();

    expect(votingStatus.openVoting).toBeFalsy();
    expect(votingStatus.cycle).toEqual(2);
    expect(votingStatus.nextOpenVotingDate).toEqual('2023-04-20T00:00:00.000Z');
    expect(votingStatus.daysUntilNextVoting).toEqual(9);
    expect(votingStatus.timeUntilNextVoting).toEqual('216:00:00');
    expect(votingStatus.userHasVoted).toBeFalsy();
  });

  test('Get voting status in an open day from the second cycle', async () => {
    jest.setSystemTime(new Date('Apr 21, 2023 00:00:00'));
    const votingStatus = await getVotingStatusAction.execute();

    expect(votingStatus.openVoting).toBeTruthy();
    expect(votingStatus.cycle).toEqual(2);
    expect(votingStatus.nextOpenVotingDate).toEqual('');
    expect(votingStatus.daysUntilNextVoting).toEqual(0);
    expect(votingStatus.timeUntilNextVoting).toEqual('');
    expect(votingStatus.userHasVoted).toBeFalsy();
  });

  test('cant get voting status when the date outside cycles', async () => {
    jest.setSystemTime(new Date('Apr 01, 2021 00:00:00'));
    expect(getVotingStatusAction.execute()).rejects.toThrow(
      DateOutsideCycleException,
    );
  });

  test('Get voting status in an open day when user has voted', async () => {
    const userUuid = 'userUuid';
    votingRepository.storeVoting(new Voting(userUuid, 1, 0));

    jest.setSystemTime(new Date('Apr 22, 2023 00:00:00'));
    const votingStatus = await getVotingStatusAction.execute(userUuid);

    expect(votingStatus.userHasVoted).toBeTruthy();
  });

});
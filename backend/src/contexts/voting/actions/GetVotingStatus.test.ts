import { DateNotValidException } from "../domain/exceptions/DateNotValidException";
import { GetVotingStatusAction } from "./GetVotingStatus";

describe('Get voting status', () => {

  test('Get voting status in an close day', async () => {
    const getVotingStatusAction = new GetVotingStatusAction();
    const date = new Date('Mar 27, 2023 00:00:00');

    const votingStatus = getVotingStatusAction.execute(date);

    expect(votingStatus.openVoting).toBeFalsy();
    expect(votingStatus.round).toEqual(1);
    expect(votingStatus.nextOpenVotingDate).toEqual('2023-04-06T00:00:00.000Z');
    expect(votingStatus.daysUntilNextVoting).toEqual(10);
    expect(votingStatus.timeUntilNextVoting).toEqual('240:00:00');
  });

  test('Get voting status in an open day', async () => {
    const getVotingStatusAction = new GetVotingStatusAction();
    const date = new Date('Apr 06, 2023 00:00:00');

    const votingStatus = getVotingStatusAction.execute(date);

    expect(votingStatus.openVoting).toBeTruthy();
    expect(votingStatus.round).toEqual(1);
    expect(votingStatus.nextOpenVotingDate).toEqual('');
    expect(votingStatus.daysUntilNextVoting).toEqual(0);
    expect(votingStatus.timeUntilNextVoting).toEqual('');
  });

  test('Get voting status in an close day from the second round', async () => {
    const getVotingStatusAction = new GetVotingStatusAction();
    const date = new Date('Apr 11, 2023 00:00:00');

    const votingStatus = getVotingStatusAction.execute(date);

    expect(votingStatus.openVoting).toBeFalsy();
    expect(votingStatus.round).toEqual(2);
    expect(votingStatus.nextOpenVotingDate).toEqual('2023-04-20T00:00:00.000Z');
    expect(votingStatus.daysUntilNextVoting).toEqual(9);
    expect(votingStatus.timeUntilNextVoting).toEqual('216:00:00');
  });

  test('Get voting status in an open day from the second round', async () => {
    const getVotingStatusAction = new GetVotingStatusAction();
    const date = new Date('Apr 22, 2023 00:00:00');

    const votingStatus = getVotingStatusAction.execute(date);

    expect(votingStatus.openVoting).toBeTruthy();
    expect(votingStatus.round).toEqual(2);
    expect(votingStatus.nextOpenVotingDate).toEqual('');
    expect(votingStatus.daysUntilNextVoting).toEqual(0);
    expect(votingStatus.timeUntilNextVoting).toEqual('');
  });

  test('cant create link with only title', async () => {
    const getVotingStatusAction = new GetVotingStatusAction();
    const date = new Date('Apr 01, 2021 00:00:00');

    expect(getVotingStatusAction.execute(date)).rejects.toThrow(
      DateNotValidException,
    );
  });

});
import { MandatoryFieldEmptyException } from '../../users/domain/exceptions/MandatoryFieldEmptyException';
import { Link } from '../domain/models/Link';
import { ViewedLinkByUserData } from '../domain/models/ViewedLinkByUserData';
import { LinkRepositoryInMemory } from '../infrastructure/persistence/repositories/LinkRepositoryInMemory';
import { ViewedLinkByUserDataRepositoryInMemory } from '../infrastructure/persistence/repositories/ViewedLinkByUserDataRepositoryInMemory';
import { GetAllMyViewedLinkAction } from './GetAllMyViewedLinkAction';

describe('Get all my viewed link action', () => {
  test('cant get all my viewed link without user', async () => {
    const getAllMyViewedLinkAction = new GetAllMyViewedLinkAction(
      new ViewedLinkByUserDataRepositoryInMemory(),
      new LinkRepositoryInMemory(),
    );

    await expect(
      getAllMyViewedLinkAction.execute('', 'linkUuid', 1),
    ).rejects.toThrow(MandatoryFieldEmptyException);
  });

  test('cant get all my viewed link without stage', async () => {
    const getAllMyViewedLinkAction = new GetAllMyViewedLinkAction(
      new ViewedLinkByUserDataRepositoryInMemory(),
      new LinkRepositoryInMemory(),
    );

    await expect(
      getAllMyViewedLinkAction.execute('userUuid', '', 0),
    ).rejects.toThrow(MandatoryFieldEmptyException);
  });

  test('returns zero links if there are no links', async () => {
    const getAllMyViewedLinkAction = new GetAllMyViewedLinkAction(
      new ViewedLinkByUserDataRepositoryInMemory(),
      new LinkRepositoryInMemory(),
    );

    await expect(
      getAllMyViewedLinkAction.execute('userUuid', 'linkUuid', 1),
    ).resolves.toEqual([]);
  });

  test('returns one or more links if there are links', async () => {
    const linkRepoInMemory = new LinkRepositoryInMemory();
    const linkDto = {
      title: 'title',
      url: 'url',
      userUuid: 'userUuid',
      categories: [{ id: 1, name: 'name', slug: 'name' }],
      stage: 1,
    };
    const link = new Link(linkDto);
    linkRepoInMemory.storeLink(link);

    const viewedLinkByUserDataRepositoryInMemory =
      new ViewedLinkByUserDataRepositoryInMemory();
    viewedLinkByUserDataRepositoryInMemory.store(
      new ViewedLinkByUserData('userUuid', link.uuid),
    );

    const getAllMyViewedLinkAction = new GetAllMyViewedLinkAction(
      viewedLinkByUserDataRepositoryInMemory,
      linkRepoInMemory,
    );
    const links = await getAllMyViewedLinkAction.execute(
      'userUuid',
      link.uuid,
      1,
    );

    expect(links.length).toEqual(1);
    expect(links[0].title).toEqual('title');
    expect(links[0].userUuid).toEqual('userUuid');
    expect(links[0].stage).toEqual(1);
  });
});

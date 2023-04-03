import { describe, expect, test } from '@jest/globals';
import { MandatoryFieldEmptyException } from '../../users/domain/exceptions/MandatoryFieldEmptyException';
import { UserNotFoundException } from '../../users/domain/exceptions/UserNotFoundException';
import { User } from '../../users/domain/models/User';
import { UserRepositoryInMemory } from '../../users/infrastructure/persistence/repositories/UserRepositoryInMemory';
import { DataDoesExistException } from '../domain/exceptions/DataDoesExistException';
import { LinkNotFoundException } from '../domain/exceptions/LinkNotFoundException';
import { Link } from '../domain/models/Link';
import { ViewedLinkByUserData } from '../domain/models/ViewedLinkByUserData';
import { LinkRepositoryInMemory } from '../infrastructure/persistence/repositories/LinkRepositoryInMemory';
import { ViewedLinkByUserDataRepositoryInMemory } from '../infrastructure/persistence/repositories/ViewedLinkByUserDataRepositoryInMemory';
import { CreateViewedLinkByUserDataAction } from './CreateViewedLinkByUserDataAction';

describe('Create viewed link by user data action', () => {

  test('cant create viewed link by user data without user', async () => {
    const createViewedLinkByUserAction = new CreateViewedLinkByUserDataAction(
      new UserRepositoryInMemory(),
      new LinkRepositoryInMemory(),
      new ViewedLinkByUserDataRepositoryInMemory()
    );

    await expect(createViewedLinkByUserAction.execute('', '')).rejects.toThrow(
      MandatoryFieldEmptyException,
    );
  });

  test('cant create viewed link by user data without link', async () => {
    const createViewedLinkByUserAction = new CreateViewedLinkByUserDataAction(
      new UserRepositoryInMemory(),
      new LinkRepositoryInMemory(),
      new ViewedLinkByUserDataRepositoryInMemory()
    );

    await expect(createViewedLinkByUserAction.execute('userUuid', '')).rejects.toThrow(
      MandatoryFieldEmptyException,
    );
  });

  test('cant create viewed link by user data when user not exists', async () => {
    const createViewedLinkByUserAction = new CreateViewedLinkByUserDataAction(
      new UserRepositoryInMemory(),
      new LinkRepositoryInMemory(),
      new ViewedLinkByUserDataRepositoryInMemory()
    );

    await expect(createViewedLinkByUserAction.execute('userUuid', 'linkUuid')).rejects.toThrow(
      UserNotFoundException,
    );
  });

  test('cant create viewed link by user data when link not exists', async () => {
    const userRepositoryInMemory = new UserRepositoryInMemory();
    await userRepositoryInMemory.storeUser(new User('email', 'username', 'password', 'userUuid'));

    const createViewedLinkByUserAction = new CreateViewedLinkByUserDataAction(
      userRepositoryInMemory,
      new LinkRepositoryInMemory(),
      new ViewedLinkByUserDataRepositoryInMemory()
    );

    await expect(createViewedLinkByUserAction.execute('userUuid', 'linkUuid')).rejects.toThrow(
      LinkNotFoundException,
    );
  });

  test('cant create viewed link by user data when data already does exist', async () => {
    const userUuid = 'userUuid';
    const userRepositoryInMemory = new UserRepositoryInMemory();
    await userRepositoryInMemory.storeUser(new User('email', 'username', 'password', userUuid));

    const linkRepositoryInMemory = new LinkRepositoryInMemory();
    const linkDto = {
      title: 'title',
      url: 'url',
      categories: [{id:1, name:'name', slug:'name'}],
      userUuid: userUuid
    };
    const link = new Link(linkDto);
    linkRepositoryInMemory.storeLink(link);

    const viewedLinkByUserDataRepositoryInMemory = new ViewedLinkByUserDataRepositoryInMemory();
    viewedLinkByUserDataRepositoryInMemory.store(
      new ViewedLinkByUserData(userUuid, link.uuid, 1)
    );

    const createViewedLinkByUserAction = new CreateViewedLinkByUserDataAction(
      userRepositoryInMemory,
      linkRepositoryInMemory,
      viewedLinkByUserDataRepositoryInMemory
    );

    await expect(createViewedLinkByUserAction.execute(userUuid, link.uuid)).rejects.toThrow(
      DataDoesExistException,
    );
  });

  test('create viewed link by user data', async () => {
    const userUuid = 'userUuid';
    const userRepositoryInMemory = new UserRepositoryInMemory();
    await userRepositoryInMemory.storeUser(new User('email', 'username', 'password', userUuid));

    const linkRepositoryInMemory = new LinkRepositoryInMemory();
    const linkDto = {
      title: 'title',
      url: 'url',
      categories: [{id:1, name:'name', slug:'name'}],
      userUuid: userUuid
    };
    const link = new Link(linkDto);
    linkRepositoryInMemory.storeLink(link);

    const viewedLinkByUserDataRepositoryInMemory = new ViewedLinkByUserDataRepositoryInMemory();

    const createViewedLinkByUserAction = new CreateViewedLinkByUserDataAction(
      userRepositoryInMemory,
      linkRepositoryInMemory,
      viewedLinkByUserDataRepositoryInMemory
    );

    await createViewedLinkByUserAction.execute(userUuid, link.uuid);

    expect(viewedLinkByUserDataRepositoryInMemory.collection.length).toEqual(1);
    expect(viewedLinkByUserDataRepositoryInMemory.collection[0].userUuid).toEqual(userUuid);
    expect(viewedLinkByUserDataRepositoryInMemory.collection[0].linkUuid).toEqual(link.uuid);
  });

});
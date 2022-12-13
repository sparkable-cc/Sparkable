import {describe, expect, test} from '@jest/globals';

import { GetAllLinksAction } from './GetAllLinksAction';

describe('Get all links action', () => {

  test('get empty when does not exist links', async () => {
    const getAllLinksAction = new GetAllLinksAction(new LinksRepositoryInMemory());

    await expect(getAllLinksAction.execute()).toEqual({});
  });

});
import { describe, expect, test } from '@jest/globals';
import { MandatoryFieldEmptyException } from '../../users/domain/exceptions/MandatoryFieldEmptyException';
import { LinkRepositoryInMemory } from '../infrastructure/persistence/repositories/LinkRepositoryInMemory';
import { CreateLinkAction } from './CreateLinkAction';

describe('Create link action', () => {
  test('cant create link without mandatory field', async () => {
    const createLinkAction = new CreateLinkAction(new LinkRepositoryInMemory());

    await expect(createLinkAction.execute({})).rejects.toThrow(
      MandatoryFieldEmptyException,
    );
  });

  test('create link only with mandatory fields', async () => {
    const linkRepository = new LinkRepositoryInMemory();
    const createLinkAction = new CreateLinkAction(linkRepository);
    const title = 'title';
    const url = 'http://test.com/test';
    const categories = ['Environment'];
    const link = {
      title: title,
      link: url,
      categories: categories,
    };

    createLinkAction.execute(link);

    const [links, total] = await linkRepository.getAllLinks();
    expect(total).toEqual(1);
    expect(links[0].title).toEqual(title);
    expect(links[0].link).toEqual(url);
    expect(links[0].categories).toEqual(categories);
  });
});

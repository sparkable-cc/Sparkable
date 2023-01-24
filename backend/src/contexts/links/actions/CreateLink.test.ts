import { describe, expect, test } from '@jest/globals';
import { MandatoryFieldEmptyException } from '../../users/domain/exceptions/MandatoryFieldEmptyException';
import { CategoryRestrictionException } from '../domain/exceptions/CategoryRestrictionException';
import { LinkExistsException } from '../domain/exceptions/LinkExistsException';
import { LinkRepositoryInMemory } from '../infrastructure/persistence/repositories/LinkRepositoryInMemory';
import { CreateLinkAction } from './CreateLinkAction';

describe('Create link action', () => {
  test('cant create link without mandatory field', async () => {
    const createLinkAction = new CreateLinkAction(new LinkRepositoryInMemory());

    await expect(createLinkAction.execute({})).rejects.toThrow(
      MandatoryFieldEmptyException,
    );
  });

  test('cant create link with only title', async () => {
    const createLinkAction = new CreateLinkAction(new LinkRepositoryInMemory());
    await expect(createLinkAction.execute({ title: 'title' })).rejects.toThrow(
      MandatoryFieldEmptyException,
    );
  });

  test('cant create link with only title and url', async () => {
    const createLinkAction = new CreateLinkAction(new LinkRepositoryInMemory());

    await expect(
      createLinkAction.execute({ title: 'title', link: 'http://example' }),
    ).rejects.toThrow(MandatoryFieldEmptyException);
  });

  test('cant create link with only categories', async () => {
    const createLinkAction = new CreateLinkAction(new LinkRepositoryInMemory());

    await expect(
      createLinkAction.execute({
        categories: ['Environment'],
      }),
    ).rejects.toThrow(MandatoryFieldEmptyException);
  });

  test('cant create link with more than 2 categories', async () => {
    const createLinkAction = new CreateLinkAction(new LinkRepositoryInMemory());

    await expect(
      createLinkAction.execute({
        title: 'title',
        link: 'http://example',
        categories: ['Environment', 'News', 'Arts'],
      }),
    ).rejects.toThrow(CategoryRestrictionException);
  });

  test('should throw error when link exists', async () => {
    const linkRepository = new LinkRepositoryInMemory();
    const createLinkAction = new CreateLinkAction(linkRepository);
    const url = 'http://example';
    await createLinkAction.execute({
      title: 'title',
      link: url,
      categories: ['Environment'],
    });

    await expect(
      createLinkAction.execute({
        title: 'title 2',
        link: url,
        categories: ['Environment', 'News'],
      }),
    ).rejects.toThrow(LinkExistsException);
  });

  test('create link with mandatory field', async () => {
    const linkRepository = new LinkRepositoryInMemory();
    const createLinkAction = new CreateLinkAction(linkRepository);
    const title = 'title';
    const url = 'http://example';
    const categories = ['Environment'];

    await createLinkAction.execute({
      title: title,
      link: url,
      categories: categories,
    });

    const [links, total] = await linkRepository.getAllLinks();

    expect(total).toEqual(1);
    expect(links[0].title).toEqual(title);
    expect(links[0].link).toEqual(url);
    expect(links[0].categories).toEqual(categories);
  });

  test('create link with optional field', async () => {
    const linkRepository = new LinkRepositoryInMemory();
    const createLinkAction = new CreateLinkAction(linkRepository);
    const title = 'title';
    const url = 'http://example';
    const categories = ['Environment'];
    const image = 'http://image';
    const description = '';

    await createLinkAction.execute({
      title: title,
      link: url,
      categories: categories,
      image: image,
      description: description,
    });

    const [links, total] = await linkRepository.getAllLinks();

    expect(total).toEqual(1);
    expect(links[0].image).toEqual(image);
    expect(links[0].description).toEqual(description);
  });
});

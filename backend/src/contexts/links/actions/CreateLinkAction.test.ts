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

  test('cant create link is category is not a well format array ', async () => {
    const createLinkAction = new CreateLinkAction(new LinkRepositoryInMemory());

    await expect(
      createLinkAction.execute({
        title: 'title',
        url: 'http://example',
        categories: ['Environment', 'Arts'],
      }),
    ).rejects.toThrow(MandatoryFieldEmptyException);
  });

  test('cant create link with only categories', async () => {
    const createLinkAction = new CreateLinkAction(new LinkRepositoryInMemory());

    await expect(
      createLinkAction.execute({
        categories: [{id:1, name:'name', slug:'name'}],
      }),
    ).rejects.toThrow(MandatoryFieldEmptyException);
  });

  test('cant create link with more than 2 categories', async () => {
    const createLinkAction = new CreateLinkAction(new LinkRepositoryInMemory());

    await expect(
      createLinkAction.execute({
        title: 'title',
        url: 'http://example',
        categories: [
          {id:1, name:'name', slug:'name'},
          {id:2, name:'name2', slug:'name2'},
          {id:3, name:'name3', slug:'name3'}
        ],
      }),
    ).rejects.toThrow(CategoryRestrictionException);
  });

  test('should throw error when link exists', async () => {
    const linkRepository = new LinkRepositoryInMemory();
    const createLinkAction = new CreateLinkAction(linkRepository);
    const url = 'http://example';
    await createLinkAction.execute({
      title: 'title',
      url: url,
      categories: [{id:1, name:'name', slug:'name'}],
    });

    await expect(
      createLinkAction.execute({
        title: 'title 2',
        url: url,
        categories: [{id:1, name:'name', slug:'name'}],
      }),
    ).rejects.toThrow(LinkExistsException);
  });

  test('create link with mandatory field', async () => {
    const linkRepository = new LinkRepositoryInMemory();
    const createLinkAction = new CreateLinkAction(linkRepository);
    const title = 'title';
    const url = 'http://example';
    const categories = [{id:1, name:'name', slug:'name'}];

    await createLinkAction.execute({
      title: title,
      url: url,
      categories: categories,
    });

    const [links, total] = await linkRepository.getAllLinks();

    expect(total).toEqual(1);
    expect(links[0].title).toEqual(title);
    expect(links[0].url).toEqual(url);
    expect(links[0].categories).toEqual(categories);
  });

  test('create link with optional field', async () => {
    const linkRepository = new LinkRepositoryInMemory();
    const createLinkAction = new CreateLinkAction(linkRepository);
    const title = 'title';
    const url = 'http://example';
    const categories = [{id:1, name:'name', slug:'name'}];
    const image = 'http://image';
    const description = '123';

    await createLinkAction.execute({
      title: title,
      url: url,
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
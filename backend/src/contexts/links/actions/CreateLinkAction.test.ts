import { describe, expect, test } from '@jest/globals';
import { MandatoryFieldEmptyException } from '../../users/domain/exceptions/MandatoryFieldEmptyException';
import { CategoryNotFoundException } from '../domain/exceptions/CategoryNotFoundException';
import { CategoryRestrictionException } from '../domain/exceptions/CategoryRestrictionException';
import { LinkExistsException } from '../domain/exceptions/LinkExistsException';
import { CategoryRepository } from '../domain/repositories/CategoryRepository';
import { LinkRepository } from '../domain/repositories/LinkRepository';
import { CategoryRepositoryInMemory } from '../infrastructure/persistence/repositories/CategoryRepositoryInMemory';
import { LinkRepositoryInMemory } from '../infrastructure/persistence/repositories/LinkRepositoryInMemory';
import { CreateLinkAction } from './CreateLinkAction';

describe('Create link action', () => {
  let createLinkAction: CreateLinkAction;
  let linkRepository: LinkRepository;
  let categoryRepository: CategoryRepository;

  beforeEach(async () => {
    linkRepository = new LinkRepositoryInMemory();
    categoryRepository = new CategoryRepositoryInMemory();
    createLinkAction = new CreateLinkAction(
      linkRepository,
      categoryRepository
    );
  });

  test('cant create link without mandatory field', async () => {
    await expect(createLinkAction.execute({})).rejects.toThrow(
      MandatoryFieldEmptyException,
    );
  });

  test('cant create link with only title', async () => {
    await expect(createLinkAction.execute({ title: 'title' })).rejects.toThrow(
      MandatoryFieldEmptyException,
    );
  });

  test('cant create link with only title and url', async () => {
    await expect(
      createLinkAction.execute({ title: 'title', link: 'http://example' }),
    ).rejects.toThrow(MandatoryFieldEmptyException);
  });

  test('cant create link is category is not a well format array ', async () => {
    await expect(
      createLinkAction.execute({
        title: 'title',
        url: 'http://example',
        categories: ['Environment', 'Arts'],
      }),
    ).rejects.toThrow(MandatoryFieldEmptyException);
  });

  test('cant create link with only categories', async () => {
    await expect(
      createLinkAction.execute({
        categories: [{id:1, name:'name', slug:'name'}],
      }),
    ).rejects.toThrow(MandatoryFieldEmptyException);
  });

  test('cant create link with more than 2 categories', async () => {
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

  test('cant create link when the category does not exist', async () => {
    await expect(
      createLinkAction.execute({
        title: 'title',
        url: 'http://example',
        categories: [
          {id:1, name:'name', slug:'name'},
        ],
      }),
    ).rejects.toThrow(CategoryNotFoundException);
  });

  test('should throw error when link exists', async () => {
    const categoryDto = {id:1, name:'name', slug:'name'};
    const categoryRepository = new CategoryRepositoryInMemory(
      [categoryDto]
    );
    createLinkAction = new CreateLinkAction(
      linkRepository,
      categoryRepository
    );
    const url = 'http://example';

    await createLinkAction.execute({
      title: 'title',
      url: url,
      categories: [categoryDto],
    });

    await expect(
      createLinkAction.execute({
        title: 'title 2',
        url: url,
        categories: [categoryDto],
      }),
    ).rejects.toThrow(LinkExistsException);
  });

  test('create link with mandatory field', async () => {
    const title = 'title';
    const url = 'http://example';
    const categoryDto = {id:1, name:'name', slug:'name'};
    const categoryRepository = new CategoryRepositoryInMemory(
      [categoryDto]
    );
    createLinkAction = new CreateLinkAction(
      linkRepository,
      categoryRepository
    );

    await createLinkAction.execute({
      title: title,
      url: url,
      categories: [categoryDto],
    });

    const [links, total] = await linkRepository.getAllLinks();

    expect(total).toEqual(1);
    expect(links[0].title).toEqual(title);
    expect(links[0].url).toEqual(url);
    expect(links[0].categories).toEqual([categoryDto]);
  });

  test('create link with optional field', async () => {
    const title = 'title';
    const url = 'http://example';
    const image = 'http://image';
    const description = '123';
    const categoryDto = {id:1, name:'name', slug:'name'};
    const categoryRepository = new CategoryRepositoryInMemory(
      [categoryDto]
    );
    createLinkAction = new CreateLinkAction(
      linkRepository,
      categoryRepository
    );

    await createLinkAction.execute({
      title: title,
      url: url,
      categories: [categoryDto],
      image: image,
      description: description,
    });

    const [links, total] = await linkRepository.getAllLinks();

    expect(total).toEqual(1);
    expect(links[0].image).toEqual(image);
    expect(links[0].description).toEqual(description);
  });
});
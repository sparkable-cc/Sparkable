import { describe, expect, test } from '@jest/globals';
import { MandatoryFieldEmptyException } from '../../users/domain/exceptions/MandatoryFieldEmptyException';
import { LinkExistsException } from '../domain/exceptions/LinkExistsException';
import { Link } from '../domain/models/Link';
import { LinkRepositoryInMemory } from '../infrastructure/persistence/repositories/LinkRepositoryInMemory';
import { CreateLinkAction } from './CreateLinkAction';

describe('Create link action', () => {
  test('cant create link without mandatory field', async () => {
    const createLinkAction = new CreateLinkAction(new LinkRepositoryInMemory());

    await expect(createLinkAction.execute({})).rejects.toThrow(
      MandatoryFieldEmptyException,
    );
  });

  // test('create link with only mandatory fields', async () => {
  //   const linkRepository = new LinkRepositoryInMemory();
  //   const createLinkAction = new CreateLinkAction(linkRepository);
  //   const title = 'title';
  //   const url = 'http://test.com/test';
  //   const categories = ['Environment'];
  //   const link = {
  //     title: title,
  //     link: url,
  //     categories: categories,
  //   };

  //   createLinkAction.execute(link);

  //   const [links, total] = await linkRepository.getAllLinks();
  //   expect(total).toEqual(1);
  //   expect(links[0].title).toEqual(title);
  //   expect(links[0].link).toEqual(url);
  //   expect(links[0].categories).toEqual(categories);
  // });

  // test('create link with all fields', async () => {
  //   const linkRepository = new LinkRepositoryInMemory();
  //   const createLinkAction = new CreateLinkAction(linkRepository);
  //   const title = 'title';
  //   const url = 'http://test.com/test';
  //   const image = 'http://test.com/test.jpg';
  //   const categories = ['Environment'];
  //   const description = 'description';
  //   const link = {
  //     title: title,
  //     link: url,
  //     image: image,
  //     categories: categories,
  //     description: description,
  //   };

  //   createLinkAction.execute(link);

  //   const [links, total] = await linkRepository.getAllLinks();
  //   expect(total).toEqual(1);
  //   expect(links[0].title).toEqual(title);
  //   expect(links[0].link).toEqual(url);
  //   expect(links[0].image).toEqual(image);
  //   expect(links[0].categories).toEqual(categories);
  //   expect(links[0].description).toEqual(description);
  // });

  // test('should throw error when link already exists', async () => {
  //   const linkRepository = new LinkRepositoryInMemory();
  //   const createLinkAction = new CreateLinkAction(linkRepository);
  //   const title = 'title';
  //   const url = 'http://test.com/test';
  //   const link = {
  //     title: title,
  //     link: url,
  //     categories: ['Environment'],
  //   };
  //   linkRepository.storeLink(new Link(link));
  //   createLinkAction.execute(link);

  //   await expect(createLinkAction.execute(link)).rejects.toThrow(
  //     LinkExistsException,
  //   );
  // });

  test('should create link with link', async () => {
    const linkRepository = new LinkRepositoryInMemory();
    const createLinkAction = new CreateLinkAction(linkRepository);
    const title = 'title';
    const url = 'http://test.com/test';
    const link = {
      title: title,
      link: url,
      categories: ['Environment'],
    };

    createLinkAction.execute(link);

    const [links, total] = await linkRepository.getAllLinks();
    expect(total).toEqual(1);
    expect(links[0].title).toEqual(title);
    expect(links[0].link).toEqual(url);
  });
});

import { describe, expect, test } from '@jest/globals';
import { Link } from '../models/Link';
import { MandatoryFieldEmptyException } from '../../../_shared/domain/exceptions/MandatoryFieldEmptyException';
import { CategoryRestrictionException } from '../exceptions/CategoryRestrictionException';

describe('Create Link', () => {

  test('cant create link without mandatory field', async () => {
    expect(() => new Link({})).toThrow(MandatoryFieldEmptyException);
  });

  test('cant create link with only title', async () => {
    expect(() => new Link({ title: 'title' })).toThrow(
      MandatoryFieldEmptyException
    );
  });

  test('cant create link with only title and url', async () => {
    expect(() => new Link({ title: 'title', link: 'http://example' })).toThrow(
      MandatoryFieldEmptyException
    );
  });

  test('cant create link with only categories', async () => {
    expect(() => new Link({
      categories: [{id:1, name:'name', slug:'name'}]
    })).toThrow(
      MandatoryFieldEmptyException
    );
  });

  test('cant create link is category is not a well format array ', async () => {
    expect(() => new Link({
      title: 'title',
      url: 'http://example',
      categories: ['Environment', 'Arts']
    })).toThrow(
      MandatoryFieldEmptyException
    );
  });

  test('cant create link without user', async () => {
    expect(() => new Link({
      title: 'title',
      url: 'http://example',
      categories: [
        {id:1, name:'name', slug:'name'},
      ]
    })).toThrow(
      MandatoryFieldEmptyException
    );
  });

  test('cant create link with more than 2 categories', async () => {
    expect(() => new Link({
      title: 'title',
      url: 'http://example',
      userUuid: 'xxxxxx',
      categories: [
        {id:1, name:'name', slug:'name'},
        {id:2, name:'name2', slug:'name2'},
        {id:3, name:'name3', slug:'name3'}
      ]
    })).toThrow(
      CategoryRestrictionException
    );
  });

  test('create Link with mandatory fields', async () => {
    const title = 'title';
    const url = 'https://url';
    const categoryDto = {id:1, name:'name', slug:'name'};
    const userUuid = 'userUuid';

    const link = new Link({
      title: title,
      url: url,
      categories: [categoryDto],
      userUuid: userUuid
    });

    const linkDto = link.toDto();
    expect(typeof linkDto.uuid).toBe("string")
    expect(linkDto.title).toEqual(title);
    expect(linkDto.url).toEqual(url);
    expect(linkDto.categories).toEqual([categoryDto]);
    expect(linkDto.userUuid).toEqual(userUuid);
  });

  test('create Link with optional fields', async () => {
    const title = 'title';
    const url = 'https://url';
    const categoryDto = {id:1, name:'name', slug:'name'};
    const userUuid = 'userUuid';

    const uuid = 'uuid';
    const image = 'http://image';
    const description = '123';
    const statement =  'Lorem ipsum';
    const suggestion = 'Sports';

    const link = new Link({
      title: title,
      url: url,
      categories: [categoryDto],
      image: image,
      description: description,
      userUuid: userUuid,
      statement: statement,
      suggestionCategory: suggestion,
      uuid: uuid
    });

    const linkDto = link.toDto();
    expect(linkDto.uuid).toEqual(uuid);
    expect(linkDto.image).toEqual(image);
    expect(linkDto.description).toEqual(description);
    expect(linkDto.statement).toEqual(statement);
    expect(linkDto.suggestionCategory).toEqual(suggestion);
  });

});

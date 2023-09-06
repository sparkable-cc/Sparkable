import { describe, expect, test } from '@jest/globals';
import { MandatoryFieldEmptyException } from '../../../_shared/domain/exceptions/MandatoryFieldEmptyException';
import { LinkPreview } from '../models/LinkPreview';
import { UrlWithoutHttpsRestrictionException } from '../exceptions/UrlWithoutHttpsRestrictionException';

describe('Create Link Preview', () => {

  test('cant create link preview without url', async () => {
    expect(() => new LinkPreview(''))
    .toThrow(MandatoryFieldEmptyException);
  });

  test('cant create link with url without https', async () => {
    expect(() => new LinkPreview('url'))
    .toThrow(UrlWithoutHttpsRestrictionException);
  });

});

import { describe, expect, test } from '@jest/globals';
import { MandatoryFieldEmptyException } from '../../../_shared/domain/exceptions/MandatoryFieldEmptyException';
import { ErrorLog } from '../models/ErrorLog';

describe('Create Error', () => {

  test('cant create Error without mandatory field', async () => {
    expect(() => new ErrorLog({})).toThrow(MandatoryFieldEmptyException);
  });

  test('create Error with mandatory fields', async () => {
    const message = 'message';
    const url = 'https://sparkable.com';

    const errorLog = new ErrorLog({
      message: message,
      url: url
    });

    const errorLogDto = errorLog.toDto();
    expect(errorLogDto.message).toEqual(message);
  });

  test('create Error with optional fields', async () => {
    const userUuid = 'userUuid';

    const errorLog = new ErrorLog({
      message: 'message',
      url: 'url',
      userUuid: userUuid
    });

    const errorLogDto = errorLog.toDto();
    expect(errorLogDto.userUuid).toEqual(userUuid);
  });

});

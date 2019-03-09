import {IError, IWarn} from 'dyna-interfaces';

declare const jasmine: any, describe: any, expect: any, it: any;

import {asyncRunBox} from '../../src';

if (typeof jasmine !== 'undefined') jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

// help: https://facebook.github.io/jest/docs/expect.html

describe('async run box', () => {

  it('should run with success result', async () => {
    const result: number | undefined = await asyncRunBox<number>({
      section: 'test/simple',
      run: async () => {
        return 200;
      }
    });
    expect(result).toBe(200);
  });

  it('should run return defaultReturn in case of error', async () => {
    const result: number | undefined = await asyncRunBox<number>({
      section: 'test/simple',
      run: async () => {
        throw new Error('bad things happened');
      },
      defaultReturn: 600
    });
    expect(result).toBe(600);
  });

  it('should run with default error code', async () => {
    const errors: IError[] = [];
    const result: number | undefined = await asyncRunBox<number>({
      section: 'test/simple',
      run: async () => {
        throw new Error('Something went wrong');
      },
      errors,
      errorCode: 500
    });
    expect(result).toBe(undefined);
    expect(errors.length).toBe(1);
    expect(errors[0].code).toBe(500);
    expect(errors[0].message).toBe('general error');
    expect(errors[0].error.toString()).toBe('Error: Something went wrong');
  });

  it('should run with default error code, description etc', async () => {
    const errors: IError[] = [];
    const result: number | undefined = await asyncRunBox<number>({
      section: 'test/simple',
      run: async () => {
        throw new Error('Something went wrong');
      },
      errors,
      errorCode: 500,
      errorMessage: 'conversion error',
      errorData: {givenNalue: 233}
    });
    expect(result).toBe(undefined);
    expect(errors.length).toBe(1);
    expect(errors[0].code).toBe(500);
    expect(errors[0].message).toBe('conversion error');
    expect(errors[0].data.givenNalue).toBe(233);
  });

  it('should run with custom error code, description etc', async () => {
    const errors: IError[] = [];
    const result: number | undefined = await asyncRunBox<number>({
      section: 'test/simple',
      run: async (error, warn) => {
        error(1500, 'custom message', {dataSize: 12});
        // throw new Error();
        return undefined;
      },
      errors,
      defaultReturn: 200200,
      errorCode: 500,
      errorMessage: 'conversion error',
      errorData: {givenValue: 233}
    });
    expect(result).toBe(200200);
    expect(errors.length).toBe(1);
    expect(errors[0].code).toBe(1500);
    expect(errors[0].message).toBe('custom message');
    expect(errors[0].data.givenValue).toBe(233);
    expect(errors[0].data.dataSize).toBe(12);
  });

  it('should run with errors and warns', async () => {
    const errors: IError[] = [];
    const warns: IWarn[] = [];
    const result: number | undefined = await asyncRunBox<number>({
      section: 'test/simple',
      run: async (error, warn) => {
        warn(1500, 'custom warn message', {dataSize: 12});
        throw new Error('Something went wrong')
      },
      errors, warns,
      errorCode: 500,
      errorMessage: 'conversion error',
      errorData: {givenValue: 233}
    });
    expect(result).toBe(undefined);
    expect(errors.length).toBe(1);
    expect(errors[0].code).toBe(500);
    expect(errors[0].message).toBe('conversion error');
    expect(errors[0].data.givenValue).toBe(233);
    expect(warns.length).toBe(1);
    expect(warns[0].code).toBe(1500);
    expect(warns[0].message).toBe('custom warn message');
    expect(warns[0].data.dataSize).toBe(12);
  });

  it('should run return warns in case of exceptions', async () => {
    const errors: IError[] = [];
    const warns: IWarn[] = [];
    const result: number | undefined = await asyncRunBox<number>({
      section: 'test/simple',
      run: async () => {
        throw new Error('bad things happened');
      },
      exceptionsAsWarns: true,
      errors, warns,
      defaultReturn: 600
    });
    expect(result).toBe(600);
    expect(errors.length).toBe(0);
    expect(warns.length).toBe(1);
    expect(warns[0].data.error.toString()).toBe('Error: bad things happened');
  });

});

import {IError, IWarn} from "dyna-interfaces";

declare let jasmine: any, describe: any, expect: any, it: any;

import {runBox} from '../../src/runBox';

if (typeof jasmine !== 'undefined') jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

// help: https://facebook.github.io/jest/docs/expect.html

describe('run box', () => {

  it('should run with success result', () => {
    let result: number = runBox<number>({
      section: 'test/simple',
      run: () => {
        return 200;
      }
    });
    expect(result).toBe(200);
  });

  it('should run return defaultReturn in case of error', () => {
    let result: number = runBox<number>({
      section: 'test/simple',
      run: () => {
        throw new Error('bad things happened');
      },
      defaultReturn: 600
    });
    expect(result).toBe(600);
  });

  it('should run with default error code', () => {
    let errors: IError[] = [];
    let result: number = runBox<number>({
      section: 'test/simple',
      run: () => {
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

  it('should run with default error code, description etc', () => {
    let errors: IError[] = [];
    let result: number = runBox<number>({
      section: 'test/simple',
      run: () => {
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

  it('should run with custom error code, description etc', () => {
    let errors: IError[] = [];
    let result: number = runBox<number>({
      section: 'test/simple',
      run: (error: (code?: string | number, message?: string, additionalData?: any) => void) => {
        error(1500, 'custom message', {dataSize: 12});
        return null;
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

  it('should run with errors and warns', () => {
    let errors: IError[] = [];
    let warns: IWarn[] = [];
    let result: number = runBox<number>({
      section: 'test/simple',
      run: (error: (code?: string | number, message?: string, additionalData?: any) => void,
            warn: (code?: string | number, message?: string, additionalData?: any) => void,) => {
        warn(1500, 'custom warn message', {dataSize: 12});
        throw new Error('Something went wrong')
        //return null;
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

  it('should run return warns in case of esceptions', () => {
    let errors: IError[] = [];
    let warns: IWarn[] = [];
    let result: number = runBox<number>({
      section: 'test/simple',
      run: () => {
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

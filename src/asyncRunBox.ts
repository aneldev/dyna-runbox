import { IError, IWarn } from "dyna-interfaces";

export interface IAsyncRunBox<TResult> {
  section: string,
  run: (error: (code: string | number, message?: string, data?: any) => void,     // trigger custom errors
        warn: (code: string | number, message: string, data?: any) => void,       // add a warn
  ) => Promise<TResult>,
  defaultReturn?: TResult,            // will be returned in case of error
  errorCode?: string | number,  // default error code, in case on raised error
  errorMessage?: string,        // default error message, in case on raised error
  errorData?: any,              // error data ara debug data will be delivered with the error
  errors?: IError[],            // the error object will be added here
  warns?: IWarn[],              // the warn object will be added here
  localErrors?: IError[],       // locals are arrays that update as the above
  localWarns?: IWarn[],         // .. the owner of the runBox provides empty array so only the errors from this runBox (and the nested) will be in the locals
  exceptionsAsWarns?: boolean,  // in case of exception export the event as warn and not as error, this is usefic for not critican run boxes; error() function still creates errors
}

export { IError, IWarn };

export const asyncRunBox = <TResult>(params_: IAsyncRunBox<TResult>): Promise<TResult> => {
  let params: IAsyncRunBox<TResult> = {
    errorMessage: 'general error',
    ...params_,
  };
  let output: TResult = params.defaultReturn;
  let hasError: boolean = false;

  const createErrorObject = (code?: string | number, message?: string, error?: any, additionalData: any = {}): IError => ({
    code: code || params.errorCode,
    section: params.section,
    message: message || params.errorMessage,
    data: {
      ...(params.errorData || {}),
      ...additionalData,
    },
    error
  });

  const createWarnObject = (code?: string | number, message?: string, additionalData: any = {}): IWarn => ({
    code,
    section: params.section,
    message: message || params.errorMessage,
    data: {
      ...(params.errorData || {}),
      ...additionalData,
    },
  });

  return new Promise<TResult>((resolve: (data: TResult) => void, reject: (error: IError) => void) => {
    try {
      return params.run(
        (code: string | number, message?: string, data?: any) => {
          params.errors && params.errors.push(createErrorObject(code, message, null, data));
          params.localErrors && params.localErrors.push(createErrorObject(code, message, null, data));
          hasError = true;
        },
        (code: string | number, message: string, data?: any) => {
          params.warns && params.warns.push(createWarnObject(code, message, data));
          params.localWarns && params.localWarns.push(createWarnObject(code, message, data));
        }
      );
    } catch (error) {
      const additionalData: any = { error, message: error.message, uncautchedError: true };
      if (params.exceptionsAsWarns) {
        params.warns && params.warns.push(createWarnObject(null, null, additionalData));
        params.localWarns && params.localWarns.push(createWarnObject(null, null, additionalData));
      }
      else {
        params.errors && params.errors.push(createErrorObject(null, null, error, additionalData));
        params.localErrors && params.localErrors.push(createErrorObject(null, null, error, additionalData));
        hasError = true;
      }
    }

    if (hasError && params.defaultReturn) {
      resolve(params.defaultReturn);
    }
  });

};

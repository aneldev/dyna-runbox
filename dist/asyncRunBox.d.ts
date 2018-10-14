import { IError, IWarn } from "dyna-interfaces";
export interface IAsyncRunBox<TResult> {
    section: string;
    run: (error: (code: string | number, message?: string, data?: any) => void, // trigger custom errors
    warn: (code: string | number, message: string, data?: any) => void) => Promise<TResult>;
    defaultReturn?: TResult;
    errorCode?: string | number;
    errorMessage?: string;
    errorData?: any;
    errors?: IError[];
    warns?: IWarn[];
    localErrors?: IError[];
    localWarns?: IWarn[];
    exceptionsAsWarns?: boolean;
}
export { IError, IWarn };
export declare const asyncRunBox: <TResult>(params_: IAsyncRunBox<TResult>) => Promise<TResult>;

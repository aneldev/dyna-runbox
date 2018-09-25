import { IError, IWarn } from "dyna-interfaces";
export interface IRunBox<T> {
    section: string;
    run: (error: (code: string | number, message?: string, data?: any) => void, // trigger custom errors
    warn: (code: string | number, message: string, data?: any) => void) => T;
    defaultReturn?: T;
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
export declare const runBox: <T>(params_: IRunBox<T>) => T;

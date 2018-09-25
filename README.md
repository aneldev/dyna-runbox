# About

Synchronous runBox.

_This is not sandbox!_

# Syntax

`runBox = <T>(params: IRunBox<T>): T`

# Params

```
interface IRunBox<T> {
	section: string,
	run: (error: (code: string | number, message?: string, data?: any) => void,     // trigger custom errors
	      warn: (code: string | number, message: string, data?: any) => void) => T, // add a warn
	defaultReturn?: T,            // will be returned in case of error
	errorCode?: string | number,  // default error code, in case on raised error
	errorMessage?: string,        // default error message, in case on raised error
	errorData?: any,              // error data ara debug data will be delivered with the error
	errors?: IError[],            // the error object will be added here
	warns?: IWarn[],              // the warn object will be added here
	localErrors?: IError[],       // locals are arrays that update as the above
	localWarns?: IWarn[],         // .. the owner of the runBox provides empty array so only the errors from this runBox (and the nested) will be in the locals
	exceptionsAsWarns?: boolean,  // in case of exception export the event as warn and not as error, this is usefic for not critican run boxes; error() function still creates errors
}

```

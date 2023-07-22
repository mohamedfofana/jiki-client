import { ErrorHandler, Injectable } from '@angular/core';

// Provided in root injector
@Injectable()
export class CustomErrorHandler implements ErrorHandler {

  constructor() { }

  /*
   * unknown au lieu de any car unkown
   * unknown is the type-safe counterpart of any. 
   * Anything is assignable to unknown, 
   * but unknown isn’t assignable to anything but itself and any without a type assertion or a control flow based narrowing. 
  */
  handleError(error: unknown): void {
    throw new Error('CustomErrorHandler Method not implemented.'+  error);
  }
}

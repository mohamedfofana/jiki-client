import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

// Provided in root injector
@Injectable()
export class CustomErrorHandler implements ErrorHandler {

  constructor(private injector: Injector) { }

  /*
   * unknown au lieu de any car unkown
   * unknown is the type-safe counterpart of any. 
   * Anything is assignable to unknown, 
   * but unknown isn’t assignable to anything but itself and any without a type assertion or a control flow based narrowing. 
  */
  handleError(error: any): void {
    let router = this.injector.get(Router);
      
    router.navigate(['/error']);   
    //throw new Error('CustomErrorHandler Method not implemented.'+  error.error);
  }
}

import { StorageService } from './../services/local/storage.service';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError, pipe } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { GrowlerService, GrowlerMessageType } from '../growler/growler.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private growler: GrowlerService, private _storageService: StorageService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string = this._storageService.getToken();
    if (token) {
      request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
    }
    if (!request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    }
    return next.handle(request);
      // pipe(
      //   map(event => {
      //     if (event instanceof HttpResponse && request.url.endsWith('login')) {

      //     }
      //   }))
      // );
  }
}

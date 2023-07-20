import { StorageService } from './../services/local/storage.service';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/database/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private _storageService: StorageService,
              private _authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //console.log('AuthInterceptor -> intercept');
    const token: string = this._storageService.getToken();
    if (this._authService.isLoggedIn()) {
      request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
    }
    if (!request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    }
    return next.handle(request);

  }
}

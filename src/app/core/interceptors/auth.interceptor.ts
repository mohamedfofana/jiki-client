import { StorageService } from './../services/local/storage.service';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, count, delay, retry, tap } from 'rxjs';
import { AuthService } from '../services/database/auth.service';
import { LoaderService } from '../services/loader/loader.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private _storageService: StorageService,
              private _authService: AuthService,
              private _loaderService: LoaderService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this._loaderService.requestStarted();
    
    const token: string = this._storageService.getToken();
    if (this._authService.isLoggedIn()) {
      request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
    }
    if (!request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    }
    return this.handler(request, next);
  }

  handler(request: HttpRequest<any>, next: HttpHandler){
    //console.log('request = '+ request.url);
      return next.handle(request)
        .pipe(
          tap({ 
            next: (event) => {
              if(event instanceof HttpResponse){
                this._loaderService.requestEndend();
              }
            },
            error: (error)=> {
              this._loaderService.resetLoader();        
              throw error;
            } 
          })
        );

  }


}

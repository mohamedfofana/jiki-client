import { StorageService } from './../local/storage.service';
import { Injectable, Output, EventEmitter, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { IUserLogin, IAuthResponse } from '../../../shared/interfaces';
import { AppConfigService } from '../../config/appconfig-service';
import { JwtTokenService } from './jwt-token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

    isAuthenticated = false;
    isAdmin = false;
    redirectUrl: string;
    @Output() authChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private _http: HttpClient,
                private _storageService: StorageService,
                private _appConfigService: AppConfigService,
                private _jwtTokenService: JwtTokenService) { }

    public userAuthChanged(status: boolean) {
        this.isAuthenticated = status;
        this.authChanged.emit(status);
    }


    login(userLogin: IUserLogin): Observable<boolean> {
        return this._http.post<IAuthResponse>(this._appConfigService.apiConfig().authUrl, userLogin)
            .pipe(
                map(response => {
                    if (response.status){
                        this._storageService.login(response.user, response.token);
                        this._jwtTokenService.initToken(response.token);
                    }
                    this.userAuthChanged(response.status);
                    return response.status;
                }),
                catchError(this._appConfigService.handleError)
            );
    }

    logout(){
      this._storageService.logout();
    }

    isLoggedIn(){
      //console.log('AuthService -> isLoggedIn');
      const jwtToken = this._jwtTokenService.getToken();

      if(this._storageService.isUserInStorage()){
        if(!jwtToken){
          const token = this._storageService.getToken();
          this._jwtTokenService.initToken(token);
        }
        if(this._jwtTokenService.isUserCertified() && !this._jwtTokenService.isTokenExpired()){
            return true;
        }
      }
      return false;
    }
}

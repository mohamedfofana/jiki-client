import { StorageService } from './../local/storage.service';
import { Injectable, Output, EventEmitter, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { IUserLogin, IAuthResponse } from '../../../shared/interfaces';
import { AppConfigService } from '../../config/appconfig-service';
import { JwtTokenService } from './jwt-token.service';
import { findEnumValueByKey } from '../../helpers/enum.helpers';
import { UserRoleEnum } from 'src/app/shared/enum/user-role-enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

    isAuthenticated$ = new BehaviorSubject<boolean>(false);
    redirectUrl: string;
    //@Output() authChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private _http: HttpClient,
                private _storageService: StorageService,
                private _appConfigService: AppConfigService,
                private _jwtTokenService: JwtTokenService) { }

    public userAuthChanged(status: boolean) {
        this.isAuthenticated$.next(status);
    }

    isAuthenticatedSub(){
      return this.isAuthenticated$.asObservable();
    }

    isAuthenticatedValue(){
      return this.isAuthenticated$.value;
    }

    isLoggedIn() {
      return this.isAuthenticatedValue();
    }
    
    isUserAdmin(){
      if(this.isAuthenticatedValue()){
        const user = this._storageService.getUser();
        let role = findEnumValueByKey(UserRoleEnum, user.role);
        
        return (role === UserRoleEnum.ADMIN) ? true : false;
      }

      return false;
    }

    login(userLogin: IUserLogin): Observable<IAuthResponse> {
        return this._http.post<IAuthResponse>(this._appConfigService.apiConfig().authUrl, userLogin);
    }

    logout(){
      this._storageService.logout();
      this.userAuthChanged(false);
    }

    isUserAndTokenValid(){
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

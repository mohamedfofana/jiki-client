import { StorageService } from './../local/storage.service';
import { Injectable, Output, EventEmitter, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';

import { IUserLogin, IAuthResponse } from '../../../shared/interfaces';
import { JwtTokenService } from './jwt-token.service';
import { UserRoleEnum } from 'src/app/shared/enum/user-role-enum';
import { UserJobtitleEnum } from 'src/app/shared/enum/user-jobTitle.enum';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

    isAuthenticated$ = new BehaviorSubject<boolean>(false);
    redirectUrl: string;

    constructor(private _http: HttpClient,
                private _storageService: StorageService,
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
        
        return (user.role === UserRoleEnum.ADMIN) ? true : false;
      }

      return false;
    }

    login(userLogin: IUserLogin): Observable<IAuthResponse> {
        return this._http.post<IAuthResponse>('http://localhost:8181/login', userLogin);
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

    
    isUserManager(): boolean {
      return  (UserJobtitleEnum.MANAGER === this._storageService.getUser().jobTitle || 
              UserJobtitleEnum.TEAM_LEADER === this._storageService.getUser().jobTitle || 
              UserJobtitleEnum.SCRUM_MASTER === this._storageService.getUser().jobTitle);
    }
}

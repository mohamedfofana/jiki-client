import { LoggerService } from 'src/app/core/services/utils/logger.service';
import { StorageService } from './../local/storage.service';
import { Injectable, Output, EventEmitter, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { IUserLogin, IAuthResponse } from '../../../shared/interfaces';
import { AppConfig, APP_CONFIG } from '../../config/app-config.module';
import { AppConfigService } from '../local/appconfig-service';

@Injectable()
export class AuthService {

    // Can use /api/auth below when running locally
    // Full domain/port is included for Docker example
    isAuthenticated = false;
    redirectUrl: string;
    @Output() authChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private http: HttpClient, @Inject(APP_CONFIG) private appConfig: AppConfig,
                private _storageService: StorageService,
                private _appConfigService: AppConfigService,
                private _loggerService: LoggerService) { }

    public userAuthChanged(status: boolean) {
        this.isAuthenticated = status;
        this.authChanged.emit(status); // Raise changed event
    }


    login(userLogin: IUserLogin): Observable<boolean> {
        return this.http.post<IAuthResponse>(this.appConfig.authUrl, userLogin)
            .pipe(
                map(response => {
                    this.userAuthChanged(response.status);
                    if (response.status){
                        this._storageService.login(response.user, response.token);
                        this._loggerService.log(response.user);
                    }
                    return response.status;
                }),
                catchError(this._appConfigService.handleError)
            );
    }

    logout(){
      this._storageService.logout();
    }
}

import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IUser } from 'src/app/shared/model/user-model';
import { AppConfig, APP_CONFIG } from '../../config/app-config.module';
import { AppConfigService } from '../local/appconfig-service';

@Injectable()
export class UserService {
    private userUrl:string = "/user"
    constructor(private http: HttpClient,
      private _appConfigService: AppConfigService,
      @Inject(APP_CONFIG) private appConfig: AppConfig) { }

    getUsers(): Observable<IUser[]> {
        return this.http.get<IUser[]>(this.appConfig.apiEndpoint + this.userUrl + '/all')
            .pipe(catchError(this._appConfigService.handleError));
    }

}

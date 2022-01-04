import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IUser } from 'src/app/shared/model/user-model';
import { AppConfig, APP_CONFIG } from '../../config/app-config.module';
import { AppConfigService } from '../local/appconfig-service';
import { IApiResponse, IResponseType } from 'src/app/shared/interfaces';

@Injectable()
export class UserService {
    private userUrl:string = "/user"
    constructor(private http: HttpClient,
      private _appConfigService: AppConfigService,
      @Inject(APP_CONFIG) private appConfig: AppConfig) { }

    findAll(): Observable<IUser[]> {
        return this.http.get<IUser[]>(this.appConfig.apiEndpoint + this.userUrl + '/all')
            .pipe(catchError(this._appConfigService.handleError));
    }

    register(user: IUser): Observable<IResponseType<IUser>> {
      return this.http.put<IResponseType<IUser>>(this.appConfig.apiEndpoint + this.userUrl + '/register', user)
          .pipe(catchError(this._appConfigService.handleError));
    }

    update(user: IUser): Observable<IResponseType<IUser>> {
      return this.http.patch<IResponseType<IUser>>(this.appConfig.apiEndpoint + this.userUrl + '/update', user)
          .pipe(catchError(this._appConfigService.handleError));
    }

}

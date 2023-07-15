import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IBacklog } from 'src/app/shared/model/backlog.model';
import { AppConfig, APP_CONFIG } from '../../config/app-config.module';
import { AppConfigService } from '../local/appconfig-service';

@Injectable({
  providedIn: 'root',
})
export class BacklogService {
    private backlogUrl:string = "/backlog"
    constructor(private http: HttpClient,
      private _appConfigService: AppConfigService,
      @Inject(APP_CONFIG) private appConfig: AppConfig) { }

    getBacklogs(): Observable<IBacklog[]> {
        return this.http.get<IBacklog[]>(this.appConfig.apiEndpoint + this.backlogUrl + '/all')
            .pipe(catchError(this._appConfigService.handleError));
    }


    getCurrentBacklog(): Observable<IBacklog[]> {
      return this.http.get<IBacklog[]>(this.appConfig.apiEndpoint + this.backlogUrl + '/current')
          .pipe(catchError(this._appConfigService.handleError));
    }

}

import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ISprint } from 'src/app/shared/model/sprint-model';
import { AppConfig, APP_CONFIG } from '../../config/app-config.module';
import { AppConfigService } from '../local/appconfig-service';

@Injectable()
export class SprintService {
    private sprintUrl:string = "/sprint"
    constructor(private http: HttpClient,
      private _appConfigService: AppConfigService,
      @Inject(APP_CONFIG) private appConfig: AppConfig) { }

    getSprints(): Observable<ISprint[]> {
        return this.http.get<ISprint[]>(this.appConfig.apiEndpoint + this.sprintUrl + '/all')
            .pipe(catchError(this._appConfigService.handleError));
    }

    getCurrentSprintByProjectId(id:number): Observable<ISprint> {
      return this.http.get<ISprint>(this.appConfig.apiEndpoint + this.sprintUrl + '/current/project/' + id)
          .pipe(catchError(this._appConfigService.handleError));
    }

    getSprintsByProjectId(id:number): Observable<ISprint[]> {
      return this.http.get<ISprint[]>(this.appConfig.apiEndpoint + this.sprintUrl + '/project/' + id)
          .pipe(catchError(this._appConfigService.handleError));
    }

    getCurrentSprint(): Observable<ISprint[]> {
      return this.http.get<ISprint[]>(this.appConfig.apiEndpoint + this.sprintUrl + '/current')
          .pipe(catchError(this._appConfigService.handleError));
    }

    getSprintById(id:number): Observable<ISprint> {
      return this.http.get<ISprint>(this.appConfig.apiEndpoint + this.sprintUrl + '/' + id)
          .pipe(catchError(this._appConfigService.handleError));
    }

}

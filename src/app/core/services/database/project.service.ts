import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IProject } from 'src/app/shared/model/project-model';
import { AppConfig, APP_CONFIG } from '../../config/app-config.module';
import { AppConfigService } from '../local/appconfig-service';

@Injectable()
export class ProjectService {
    private projectUrl:string = "/project"
    constructor(
      private http: HttpClient,
      private _appConfigService: AppConfigService,
      @Inject(APP_CONFIG) private appConfig: AppConfig
    ) { }

    findAll(): Observable<IProject[]> {
        return this.http.get<IProject[]>(this.appConfig.apiEndpoint + this.projectUrl + '/all')
            .pipe(catchError(this._appConfigService.handleError));
    }


    findCurrent(): Observable<IProject[]> {
      return this.http.get<IProject[]>(this.appConfig.apiEndpoint + this.projectUrl + '/current')
          .pipe(catchError(this._appConfigService.handleError));
    }

    findById(id:number): Observable<IProject> {
      return this.http.get<IProject>(this.appConfig.apiEndpoint + this.projectUrl + '/' + id)
          .pipe(catchError(this._appConfigService.handleError));
    }

}

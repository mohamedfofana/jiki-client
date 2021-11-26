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

    create(project:IProject): Observable<IProject>{
        return this.http.post<IProject>(this.appConfig.apiEndpoint + this.projectUrl + '/create', project)
              .pipe(catchError(this._appConfigService.handleError));
    }

    getProjects(): Observable<IProject[]> {
        return this.http.get<IProject[]>(this.appConfig.apiEndpoint + this.projectUrl + '/all')
            .pipe(catchError(this._appConfigService.handleError));
    }


    getCurrentProject(): Observable<IProject[]> {
      return this.http.get<IProject[]>(this.appConfig.apiEndpoint + this.projectUrl + '/current')
          .pipe(catchError(this._appConfigService.handleError));
    }

    getProjectById(id:number): Observable<IProject> {
      return this.http.get<IProject>(this.appConfig.apiEndpoint + this.projectUrl + '/' + id)
          .pipe(catchError(this._appConfigService.handleError));
    }

}

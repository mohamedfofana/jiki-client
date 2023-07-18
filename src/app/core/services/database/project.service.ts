import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { IProject } from 'src/app/shared/model/project.model';
import { AppConfigService } from '../../config/appconfig-service';
import { IResponseType } from 'src/app/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
    private projectUrl:string = "/project"
    constructor(
      private http: HttpClient,
      private _appConfigService: AppConfigService
    ) { }

    findAll(): Observable<IProject[]> {
        return this.http.get<IProject[]>(this._appConfigService.apiConfig().apiEndpoint + this.projectUrl + '/all')
            .pipe(catchError(this._appConfigService.handleError));
    }

    create(project: IProject): Observable<IResponseType<IProject>> {
      project.creationDate = this._appConfigService.currentTimestamp();
      return this.http.post<IResponseType<IProject>>(this._appConfigService.apiConfig().apiEndpoint + this.projectUrl + '/create', project)
      .pipe(
        map(response => {
            return response;
        }),
        catchError(this._appConfigService.handleError)
      );
    }

    update(project: IProject): Observable<IResponseType<IProject>> {
      project.updateDate = this._appConfigService.currentTimestamp();
      return this.http.put<IResponseType<IProject>>(this._appConfigService.apiConfig().apiEndpoint + this.projectUrl + '/update', project)
          .pipe(catchError(this._appConfigService.handleError));
    }

    delete(id: number): Observable<IResponseType<IProject>> {
      return this.http.delete<IResponseType<IProject>>(this._appConfigService.apiConfig().apiEndpoint + this.projectUrl + '/delete/' + id)
          .pipe(catchError(this._appConfigService.handleError));
    }

}

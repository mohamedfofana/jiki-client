import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ISprint } from 'src/app/shared/model/sprint.model';
import { AppConfigService } from '../../config/appconfig-service';
import { IResponseType } from 'src/app/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class SprintService {
    private sprintUrl:string = "/sprint"
    constructor(private http: HttpClient,
      private _appConfigService: AppConfigService) { }

   /*
     Return current sprint of a project
    */
    getCurrentByProjectId(id:number): Observable<ISprint> {
      return this.http.get<ISprint>(this._appConfigService.apiConfig().apiEndpoint + this.sprintUrl + '/current/project/' + id)
          .pipe(catchError(this._appConfigService.handleError));
    }

  /*
	 * find sprints by project
	 */
    getSprintsByProjectId(id:number): Observable<ISprint[]> {
      return this.http.get<ISprint[]>(this._appConfigService.apiConfig().apiEndpoint + this.sprintUrl + '/project/' + id)
          .pipe(catchError(this._appConfigService.handleError));
    }
  /*
	 * find sprint by status = RUNNING
	 */
    getCurrentSprint(): Observable<ISprint[]> {
      return this.http.get<ISprint[]>(this._appConfigService.apiConfig().apiEndpoint + this.sprintUrl + '/current')
          .pipe(catchError(this._appConfigService.handleError));
    }

    create(sprint: ISprint): Observable<IResponseType<ISprint>> {
      sprint.creationDate = this._appConfigService.currentTimestamp();
      return this.http.post<IResponseType<ISprint>>(this._appConfigService.apiConfig().apiEndpoint + this.sprintUrl + '/create', sprint)
      .pipe(
        map(response => {
            return response;
        }),
        catchError(this._appConfigService.handleError)
      );
    }

    update(team: ISprint): Observable<IResponseType<ISprint>> {
      team.updateDate = this._appConfigService.currentTimestamp();
      return this.http.put<IResponseType<ISprint>>(this._appConfigService.apiConfig().apiEndpoint + this.sprintUrl + '/update', team)
          .pipe(catchError(this._appConfigService.handleError));
    }

    delete(id: number): Observable<IResponseType<ISprint>> {
      return this.http.delete<IResponseType<ISprint>>(this._appConfigService.apiConfig().apiEndpoint + this.sprintUrl + '/delete/' + id)
          .pipe(catchError(this._appConfigService.handleError));
    }

}

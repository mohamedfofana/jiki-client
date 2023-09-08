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
    findCurrentByProjectId(id:number): Observable<ISprint> {
      return this.http.get<ISprint>(this._appConfigService.apiConfig().apiEndpoint + this.sprintUrl + '/current/project/' + id);
    }

  /*
	 * find sprints by project
	 */
    findByProjectId(id:number): Observable<ISprint[]> {
      return this.http.get<ISprint[]>(this._appConfigService.apiConfig().apiEndpoint + this.sprintUrl + '/project/' + id);
    }
  /*
	 * find sprint by status = RUNNING
	 */
    findCurrentSprint(): Observable<ISprint[]> {
      return this.http.get<ISprint[]>(this._appConfigService.apiConfig().apiEndpoint + this.sprintUrl + '/current');
    }

    create(sprint: ISprint): Observable<IResponseType<ISprint>> {
      sprint.creationDate = this._appConfigService.currentTimestamp();
      sprint.updateDate = this._appConfigService.currentTimestamp();
      
      return this.http.post<IResponseType<ISprint>>(this._appConfigService.apiConfig().apiEndpoint + this.sprintUrl + '/create', sprint)
      .pipe(
        map(response => {
            return response;
        })
      );
    }

    start(sprint: ISprint): Observable<IResponseType<ISprint>> {
      sprint.updateDate = this._appConfigService.currentTimestamp();
      sprint.startDate = this._appConfigService.currentTimestamp();
      return this.http.put<IResponseType<ISprint>>(this._appConfigService.apiConfig().apiEndpoint + this.sprintUrl + '/start', sprint);
    }

    delete(id: number): Observable<IResponseType<ISprint>> {
      return this.http.delete<IResponseType<ISprint>>(this._appConfigService.apiConfig().apiEndpoint + this.sprintUrl + '/delete/' + id);
    }

}

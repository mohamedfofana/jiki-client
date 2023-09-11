import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ISprint } from 'src/app/shared/model/sprint.model';
import { AppConfigService } from '../../config/appconfig-service';
import { IResponseType } from 'src/app/shared/interfaces';
import { DateService } from '../local/date.service';

@Injectable({
  providedIn: 'root',
})
export class SprintService {
    private sprintUrl:string = "/sprint"
    constructor(private http: HttpClient,
                private _appConfigService: AppConfigService,
                private _dateService: DateService
      ) { }

   /*
     Return current sprint of a project
    */
    findCurrentByProjectId(id:number): Observable<ISprint> {
      return this.http.get<ISprint>(this._appConfigService.apiConfig().apiEndpoint + this.sprintUrl + '/current/project/' + id);
    }

     /*
     Return current sprint of a project
    */
     findRunningByProjectId(id:number): Observable<ISprint> {
      return this.http.get<ISprint>(this._appConfigService.apiConfig().apiEndpoint + this.sprintUrl + '/running/project/' + id);
    }


  /*
	 * find sprints by project
	 */
    findByProjectId(id:number): Observable<ISprint[]> {
      return this.http.get<ISprint[]>(this._appConfigService.apiConfig().apiEndpoint + this.sprintUrl + '/project/' + id);
    }
  /*
	 * find sprint by status = IN_PROGRESS
	 */
    findCurrentSprint(): Observable<ISprint[]> {
      return this.http.get<ISprint[]>(this._appConfigService.apiConfig().apiEndpoint + this.sprintUrl + '/current');
    }

    create(sprint: ISprint): Observable<IResponseType<ISprint>> {
      sprint.creationDate = this._dateService.currentTimestamp();
      sprint.updateDate = this._dateService.currentTimestamp();
      
      return this.http.post<IResponseType<ISprint>>(this._appConfigService.apiConfig().apiEndpoint + this.sprintUrl + '/create', sprint)
      .pipe(
        map(response => {
            return response;
        })
      );
    }

    start(sprint: ISprint): Observable<IResponseType<ISprint>> {
      sprint.updateDate = this._dateService.currentTimestamp();

      return this.http.put<IResponseType<ISprint>>(this._appConfigService.apiConfig().apiEndpoint + this.sprintUrl + '/start', sprint);
    }

    delete(id: number): Observable<IResponseType<ISprint>> {
      return this.http.delete<IResponseType<ISprint>>(this._appConfigService.apiConfig().apiEndpoint + this.sprintUrl + '/delete/' + id);
    }

}

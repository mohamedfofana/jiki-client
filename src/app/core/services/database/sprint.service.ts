import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ISprint } from 'src/app/shared/model/sprint.model';
import { IResponseType } from 'src/app/shared/interfaces';
import { DateService } from '../local/date.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SprintService {
    private sprintUrl:string = "/sprint"
    constructor(private http: HttpClient,
                private _dateService: DateService
      ) { }

   /*
     Return current sprint of a project
    */
    findCurrentByProjectId(id:number): Observable<ISprint> {
      return this.http.get<ISprint>('http://localhost:8181/api' + this.sprintUrl + '/current/project/' + id);
    }

     /*
     Return current sprint of a project
    */
     findRunningByProjectId(id:number): Observable<ISprint> {
      return this.http.get<ISprint>('http://localhost:8181/api' + this.sprintUrl + '/running/project/' + id);
    }

    findByStatusInProject(id:number, status: string): Observable<ISprint[]> {
      return this.http.get<ISprint[]>('http://localhost:8181/api' + this.sprintUrl + '/project/' + id + '/status/' + status);
    }

  /*
	 * find sprints by project
	 */
    findByProjectId(id:number): Observable<ISprint[]> {
      return this.http.get<ISprint[]>('http://localhost:8181/api' + this.sprintUrl + '/project/' + id);
    }
  /*
	 * find sprint by status = IN_PROGRESS
	 */
    findCurrentSprint(): Observable<ISprint[]> {
      return this.http.get<ISprint[]>('http://localhost:8181/api' + this.sprintUrl + '/current');
    }

    create(sprint: ISprint): Observable<IResponseType<ISprint>> {
      sprint.creationDate = this._dateService.currentTimestamp();
      sprint.updateDate = this._dateService.currentTimestamp();
      
      return this.http.post<IResponseType<ISprint>>('http://localhost:8181/api' + this.sprintUrl + '/create', sprint)
      .pipe(
        map(response => {
            return response;
        })
      );
    }

    close(sprint: ISprint): Observable<IResponseType<ISprint>> {
      return this.http.put<IResponseType<ISprint>>('http://localhost:8181/api' + this.sprintUrl + '/close', sprint);
    }

    start(sprint: ISprint): Observable<IResponseType<ISprint>> {
      sprint.updateDate = this._dateService.currentTimestamp();

      return this.http.put<IResponseType<ISprint>>('http://localhost:8181/api' + this.sprintUrl + '/start', sprint);
    }

    delete(id: number): Observable<IResponseType<ISprint>> {
      return this.http.delete<IResponseType<ISprint>>('http://localhost:8181/api' + this.sprintUrl + '/delete/' + id);
    }

}

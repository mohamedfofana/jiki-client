import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IProject } from 'src/app/shared/model/project.model';
import { IResponseType } from 'src/app/shared/interfaces';
import { DateService } from '../local/date.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
    private projectUrl:string = "/project"
    constructor(
      private http: HttpClient,
      private _dateService: DateService
    ) { }

    findAll(): Observable<IProject[]> {
        return this.http.get<IProject[]>(environment.API_ENDPOINT + this.projectUrl + '/all');
    }

    findByTeam(teamId: number): Observable<IProject> {
      return this.http.get<IProject>(environment.API_ENDPOINT + this.projectUrl + '/team/' + teamId);
   }

    create(project: IProject): Observable<IResponseType<IProject>> {
      project.creationDate = this._dateService.currentTimestamp();
      return this.http.post<IResponseType<IProject>>(environment.API_ENDPOINT + this.projectUrl + '/create', project)
      .pipe(
        map(response => {
            return response;
        }));
    }

    update(project: IProject): Observable<IResponseType<IProject>> {
      project.updateDate = this._dateService.currentTimestamp();
      return this.http.put<IResponseType<IProject>>(environment.API_ENDPOINT + this.projectUrl + '/update', project);
    }

    delete(id: number): Observable<IResponseType<IProject>> {
      return this.http.delete<IResponseType<IProject>>(environment.API_ENDPOINT + this.projectUrl + '/delete/' + id);
    }

}

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { IProject } from 'src/app/shared/model/project.model';
import { AppConfigService } from '../../config/appconfig-service';
import { IResponseType } from 'src/app/shared/interfaces';
import { DateService } from '../local/date.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
    private projectUrl:string = "/project"
    constructor(
      private http: HttpClient,
      private _appConfigService: AppConfigService,
      private _dateService: DateService
    ) { }

    findAll(): Observable<IProject[]> {
        return this.http.get<IProject[]>(this._appConfigService.apiConfig().apiEndpoint + this.projectUrl + '/all');
    }

    findByTeam(teamId: number): Observable<IProject> {
      return this.http.get<IProject>(this._appConfigService.apiConfig().apiEndpoint + this.projectUrl + '/team/' + teamId);
   }

    create(project: IProject): Observable<IResponseType<IProject>> {
      project.creationDate = this._dateService.currentTimestamp();
      return this.http.post<IResponseType<IProject>>(this._appConfigService.apiConfig().apiEndpoint + this.projectUrl + '/create', project)
      .pipe(
        map(response => {
            return response;
        }));
    }

    update(project: IProject): Observable<IResponseType<IProject>> {
      project.updateDate = this._dateService.currentTimestamp();
      return this.http.put<IResponseType<IProject>>(this._appConfigService.apiConfig().apiEndpoint + this.projectUrl + '/update', project);
    }

    delete(id: number): Observable<IResponseType<IProject>> {
      return this.http.delete<IResponseType<IProject>>(this._appConfigService.apiConfig().apiEndpoint + this.projectUrl + '/delete/' + id);
    }

}

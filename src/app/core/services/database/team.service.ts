import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ITeam } from 'src/app/shared/model/team.model';
import { AppConfigService } from '../../config/appconfig-service';
import { IResponseType } from 'src/app/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
    private teamUrl:string = "/team"
    constructor(
      private http: HttpClient,
      private _appConfigService: AppConfigService
    ) { }

    findAll(): Observable<ITeam[]> {
        return this.http.get<ITeam[]>(this._appConfigService.apiConfig().apiEndpoint + this.teamUrl + '/all')
            .pipe(catchError(this._appConfigService.handleError));
    }


    create(team: ITeam): Observable<IResponseType<ITeam>> {
      team.creationDate = this._appConfigService.currentTimestamp();
      return this.http.post<IResponseType<ITeam>>(this._appConfigService.apiConfig().apiEndpoint + this.teamUrl + '/create', team)
      .pipe(
        map(response => {
            return response;
        }),
        catchError(this._appConfigService.handleError)
      );
    }

    update(team: ITeam): Observable<IResponseType<ITeam>> {
      team.updateDate = this._appConfigService.currentTimestamp();
      return this.http.put<IResponseType<ITeam>>(this._appConfigService.apiConfig().apiEndpoint + this.teamUrl + '/update', team)
          .pipe(catchError(this._appConfigService.handleError));
    }

    delete(id: number): Observable<IResponseType<ITeam>> {
      return this.http.delete<IResponseType<ITeam>>(this._appConfigService.apiConfig().apiEndpoint + this.teamUrl + '/delete/' + id)
          .pipe(catchError(this._appConfigService.handleError));
    }
}

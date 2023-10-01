import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ITeam } from 'src/app/shared/model/team.model';
import { IResponseType } from 'src/app/shared/interfaces';
import { DateService } from '../local/date.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TeamService {

    private teamUrl:string = "/team"
    constructor(
      private http: HttpClient,
      private _dateService: DateService
    ) { }

    findAll(): Observable<ITeam[]> {
        return this.http.get<ITeam[]>(environment.API_ENDPOINT + this.teamUrl + '/all');
    }

    findById(id: number): Observable<ITeam> {
      return this.http.get<ITeam>(environment.API_ENDPOINT + this.teamUrl + '/'+ id);
    }
    
    findAllAvailableForProject(projectId: number | undefined): Observable<ITeam[]> {
      if(!projectId) {
        projectId = 0;
      }      
      return this.http.get<ITeam[]>(environment.API_ENDPOINT + this.teamUrl + '/allAvailableForProject/'+ projectId);
    }

    create(team: ITeam): Observable<IResponseType<ITeam>> {
      team.creationDate = this._dateService.currentTimestamp();
      return this.http.post<IResponseType<ITeam>>(environment.API_ENDPOINT + this.teamUrl + '/create', team)
      .pipe(
        map(response => {
            return response;
        })
      );
    }

    update(team: ITeam): Observable<IResponseType<ITeam>> {
      team.updateDate = this._dateService.currentTimestamp();
      return this.http.put<IResponseType<ITeam>>(environment.API_ENDPOINT + this.teamUrl + '/update', team);
    }

    delete(id: number): Observable<IResponseType<ITeam>> {
      return this.http.delete<IResponseType<ITeam>>(environment.API_ENDPOINT + this.teamUrl + '/delete/' + id);
    }
}

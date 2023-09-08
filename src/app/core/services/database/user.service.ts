import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { IUser } from 'src/app/shared/model/user.model';
import { AppConfigService } from '../../config/appconfig-service';
import { IResponseType } from 'src/app/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserService {
    private userUrl:string = "/user"
    constructor(private http: HttpClient,
      private _appConfigService: AppConfigService) { }

    findAll(): Observable<IUser[]> {
        return this.http.get<IUser[]>(this._appConfigService.apiConfig().apiEndpoint + this.userUrl + '/all');
    }

    findByTeam(teamId: number): Observable<IUser[]> {
      return this.http.get<IUser[]>(this._appConfigService.apiConfig().apiEndpoint + this.userUrl + '/team/'+teamId);
    }

    register(user: IUser): Observable<IResponseType<IUser>> {
      user.creationDate = this._appConfigService.currentTimestamp();
      return this.http.post<IResponseType<IUser>>(this._appConfigService.apiConfig().apiEndpoint + this.userUrl + '/register', user)
      .pipe(
        map(response => {
            return response;
        })
    );
    }

    update(user: IUser): Observable<IResponseType<IUser>> {
      user.updateDate = this._appConfigService.currentTimestamp();
      return this.http.put<IResponseType<IUser>>(this._appConfigService.apiConfig().apiEndpoint + this.userUrl + '/update', user);
    }

    delete(id: number): Observable<IResponseType<IUser>> {
      return this.http.delete<IResponseType<IUser>>(this._appConfigService.apiConfig().apiEndpoint + this.userUrl + '/delete/' + id);
    }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser } from 'src/app/shared/model/user.model';
import { IResponseType } from 'src/app/shared/interfaces';
import { DateService } from '../local/date.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
    private userUrl:string = "/user"
    constructor(private http: HttpClient,
      private _dateService: DateService) { }

    findAll(): Observable<IUser[]> {
        return this.http.get<IUser[]>(environment.API_ENDPOINT+ this.userUrl + '/all');
    }

    findByTeam(teamId: number): Observable<IUser[]> {
      return this.http.get<IUser[]>(environment.API_ENDPOINT+ this.userUrl + '/team/'+teamId);
    }

    register(user: IUser): Observable<IResponseType<IUser>> {
      user.creationDate = this._dateService.currentTimestamp();
      return this.http.post<IResponseType<IUser>>(environment.API_ENDPOINT+ this.userUrl + '/register', user)
      .pipe(
        map(response => {
            return response;
        })
    );
    }

    update(user: IUser): Observable<IResponseType<IUser>> {
      user.updateDate = this._dateService.currentTimestamp();
      return this.http.put<IResponseType<IUser>>(environment.API_ENDPOINT+ this.userUrl + '/update', user);
    }

    delete(id: number): Observable<IResponseType<IUser>> {
      return this.http.delete<IResponseType<IUser>>(environment.API_ENDPOINT+ this.userUrl + '/delete/' + id);
    }

}

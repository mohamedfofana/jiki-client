import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IBacklog } from 'src/app/shared/model/backlog.model';
import { AppConfigService } from '../../config/appconfig-service';

@Injectable({
  providedIn: 'root',
})
export class BacklogService {
    private backlogUrl:string = "/backlog"
    constructor(private http: HttpClient,
      private _appConfigService: AppConfigService) { }

    getBacklogs(): Observable<IBacklog[]> {
        return this.http.get<IBacklog[]>(this._appConfigService.apiConfig().apiEndpoint + this.backlogUrl + '/all')
            .pipe(catchError(this._appConfigService.handleError));
    }


    getCurrentBacklog(): Observable<IBacklog[]> {
      return this.http.get<IBacklog[]>(this._appConfigService.apiConfig().apiEndpoint + this.backlogUrl + '/current')
          .pipe(catchError(this._appConfigService.handleError));
    }

}

import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { IBacklog } from 'src/app/shared/model/backlog-model';
import { AppConfig, APP_CONFIG } from '../../config/app-config.module';

@Injectable()
export class BacklogService {
    private backlogUrl:string = "/backlog"
    constructor(private http: HttpClient, @Inject(APP_CONFIG) private appConfig: AppConfig) { }

    getBacklogs(): Observable<IBacklog[]> {
        return this.http.get<IBacklog[]>(this.appConfig.apiEndpoint + this.backlogUrl + '/all')
            .pipe(catchError(this.handleError));
    }


    getCurrentBacklog(): Observable<IBacklog[]> {
      return this.http.get<IBacklog[]>(this.appConfig.apiEndpoint + this.backlogUrl + '/current')
          .pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        console.error('server error:', error);
        if (error.error instanceof Error) {
            const errMessage = error.error.message;
            return Observable.throw(errMessage);
        }
        return Observable.throw("Erreur hand " + error || 'Server error');
    }

}

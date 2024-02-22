import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { IBacklog } from 'src/app/shared/model/backlog.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BacklogService {
    private backlogUrl:string = "/backlog"
    constructor(private http: HttpClient) { }

    getBacklogs(): Observable<IBacklog[]> {
        return this.http.get<IBacklog[]>(environment.API_ENDPOINT+ this.backlogUrl + '/all');
    }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IVersion } from 'src/app/shared/model/version.model';
import { Observable, map } from 'rxjs';
import { IResponseType } from 'src/app/shared/interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  private versionUrl:string = "/version"
  constructor(private http: HttpClient) { }

  findByProject(projectId: number): Observable<IVersion[]> {
    return this.http.get<IVersion[]>('http://localhost:8181/api' + this.versionUrl + '/project/'+projectId);
  }

  create(version: IVersion): Observable<IResponseType<IVersion>> {
    return this.http.post<IResponseType<IVersion>>('http://localhost:8181/api' + this.versionUrl + '/create', version)
    .pipe(
      map(response => {
          return response;
      })
    );
  }
    
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../../config/appconfig-service';
import { IVersion } from 'src/app/shared/model/version.model';
import { Observable, map } from 'rxjs';
import { IResponseType } from 'src/app/shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  private versionUrl:string = "/version"
  constructor(private http: HttpClient,
    private _appConfigService: AppConfigService) { }

  findByProject(projectId: number): Observable<IVersion[]> {
    return this.http.get<IVersion[]>(this._appConfigService.apiConfig().apiEndpoint + this.versionUrl + '/project/'+projectId);
  }

  create(version: IVersion): Observable<IResponseType<IVersion>> {
    return this.http.post<IResponseType<IVersion>>(this._appConfigService.apiConfig().apiEndpoint + this.versionUrl + '/create', version)
    .pipe(
      map(response => {
          return response;
      })
    );
  }
    
}

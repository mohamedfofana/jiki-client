import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IAppConfig } from '../../../shared/model/app-config.model';
import { AppProperties } from './../../config/app-properties.module';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable()
export class AppConfigService {

  constructor(private _http: HttpClient) {}

    private config:any|null;

    public settings() {
        return this.config;
    }

    /**
     * Use to get the data found in the second file (config file)
     */
    public getProperty(key: any) {
      return this.config[key];
  }

    public load(): Promise<any> {
      return new Promise<void>((resolve, reject) => {
        this._http.get(AppProperties.config_file).toPromise().then((response) => {
           this.config = response;
           resolve();
        }).catch((response: any) => {
           reject('Could not load file ' + AppProperties.config_file + ': ${JSON.stringify(response)}');
        });
    });
    }
    public handleError(error: HttpErrorResponse) {
      console.error('server error:', error);
      if (error.error instanceof Error) {
          const errMessage = error.error.message;
          return throwError(errMessage);
          // Use the following instead if using lite-server
          // return Observable.throw(err.text() || 'backend server error');
      }
      return throwError("Erreur hand " + error || 'Server error');
  }
}

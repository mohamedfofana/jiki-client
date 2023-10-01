import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppProperties } from './app-properties.module';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

export class AppConfig {
  apiEndpoint: string;
  authUrl: string;
  options: any;
  
}

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {

  constructor(private _http: HttpClient) {}
  
    private config:any|null;

    public getProperty(key: string) {
      return this.config[key];
    }

    public getSprintStatusIcon(status: string){
      return this.getProperty("cdk.sprint.status." + status +".icon");
    }

    public getSprintTypeIcon(status: string){
      return this.getProperty("cdk.sprint.type." + status +".icon");
    }

    public getStoryStatusIcon(status: string){
      return this.getProperty("cdk.story.status." + status +".icon");
    }

    public getStoryTypeIcon(type: string){
      return this.getProperty("cdk.story.type." + type +".icon");
    }

    public getStoryStatusIconColor(status: string){
      return this.getProperty("cdk.story.status." + status +".icon.color");
    }

    public getStoryTypeIconColor(type: string){
      return this.getProperty("cdk.story.type." + type +".icon.color");
    }

    public getSprintStatusIconColor(status: string){
      return this.getProperty("cdk.sprint.status." + status +".icon.color");
    }

    public getSprintTypeIconColor(type: string){
      return this.getProperty("cdk.sprint.type." + type +".icon.color");
    }

    async load(): Promise<any> {
      return new Promise<void>((resolve, reject) => {
        this._http.get(AppProperties.properties_file).toPromise().then((response) => {
           this.config = response;
           resolve();
        }).catch((response: any) => {
           reject('Could not load file ' + AppProperties.properties_file + ': ${JSON.stringify(response)}');
        });
      });
    }

    public handleError(error: HttpErrorResponse) {
      if (error.error instanceof Error) {
          const errMessage = error.error.message;
          return throwError(errMessage);
      }
      throw error;
    }
}

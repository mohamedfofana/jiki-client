import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AppProperties } from './app-properties.module';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { DatePipe } from '@angular/common';

export class AppConfig {
  apiEndpoint: string;
  authUrl: string;
  options: any;
  
}

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {

  constructor(private _http: HttpClient,
              private _datePipe: DatePipe) {}
    static readonly DEV_CONFIG = 'devConfig';
    static readonly PROD_CONFIG = 'prodConfig';
    private config:any|null;
   
    public settings() {
        return this.config;
    }

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

    private devConfig (): AppConfig{
      const config = this.config[AppConfigService.DEV_CONFIG];
      return config;
    } 

    private prodConfig (): AppConfig{     
      const config = this.config[AppConfigService.PROD_CONFIG];
      return config;
    } 

    public apiConfig(): AppConfig{ 
      if(environment.production){ 
        return this.prodConfig();
      } 
      return this.devConfig();
    }

    async load(): Promise<any> {
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
      console.error('AppConfigService Global HTTP error handler');
      if (error.error instanceof Error) {
          const errMessage = error.error.message;
          return throwError(errMessage);
      }
      throw error;
    }

  currentTimestamp(): string{
    return <string> this._datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
  }
}

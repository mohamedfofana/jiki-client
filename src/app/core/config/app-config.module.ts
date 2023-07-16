import { NgModule, InjectionToken } from "@angular/core";
import { HttpHeaders } from '@angular/common/http';

export let APP_CONFIG = new InjectionToken("app.config");

export class AppConfig {
    apiEndpoint: string;
    authUrl: string;
    options: any;
    
}

export const APP_DEV_CONFIG: AppConfig = {    
    apiEndpoint: "http://localhost:8181/api",
    authUrl: "http://localhost:8181/login",
    options: ({ headers: new HttpHeaders({ 'Content-Type': 'application/json' }).set('Access-Control-Allow-Origin', '*')})
};

export const APP_PROD_CONFIG: AppConfig = {    
    apiEndpoint: "https://www.jiki.com/api",
    authUrl: "https://www.jiki.com/login",
    options: ({ headers: new HttpHeaders({ 'Content-Type': 'application/json' }).set('Access-Control-Allow-Origin', '*')})
};

@NgModule({
  providers: [{
    provide: APP_CONFIG,
    useValue: APP_DEV_CONFIG
  }]
})
export class AppConfigModule { }

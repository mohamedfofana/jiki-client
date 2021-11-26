import { IStory } from './../../../shared/model/story-model';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AppConfig, APP_CONFIG } from '../../config/app-config.module';
import { AppConfigService } from '../local/appconfig-service';

@Injectable()
export class StoryService {
    private storyUrl:string = "/story"
    constructor(private http: HttpClient,
      private _appConfigService: AppConfigService,
      @Inject(APP_CONFIG) private appConfig: AppConfig) { }

    getStories(): Observable<IStory[]> {
        return this.http.get<IStory[]>(this.appConfig.apiEndpoint + this.storyUrl + '/all')
            .pipe(catchError(this._appConfigService.handleError));
    }

    getStoriesByReporterId(reporterId:number): Observable<IStory[]> {
      return this.http.get<IStory[]>(this.appConfig.apiEndpoint + this.storyUrl + '/user/'+reporterId)
          .pipe(catchError(this._appConfigService.handleError));
    }

    getStoriesByProject(projectId:number): Observable<IStory[]> {
      return this.http.get<IStory[]>(this.appConfig.apiEndpoint + this.storyUrl + '/project/'+projectId)
          .pipe(catchError(this._appConfigService.handleError));
    }

    getStoriesByProjectAndSprint(projectId:number, sprintId:number): Observable<IStory[]> {
      return this.http.get<IStory[]>(this.appConfig.apiEndpoint + this.storyUrl + '/project/'+projectId+ '/sprint/'+sprintId)
          .pipe(catchError(this._appConfigService.handleError));
    }

    getByProjectIdAndCurrentSprint(projectId:number): Observable<IStory[]> {
      return this.http.get<IStory[]>(this.appConfig.apiEndpoint + this.storyUrl + '/current/sprint/project/'+projectId)
          .pipe(catchError(this._appConfigService.handleError));
    }

    getStoriesBySprint(sprintId:number): Observable<IStory[]> {
      return this.http.get<IStory[]>(this.appConfig.apiEndpoint + this.storyUrl + '/sprint/'+sprintId)
          .pipe(catchError(this._appConfigService.handleError));
    }

    getStoriesByBacklog(backlogId:number): Observable<IStory[]> {
      return this.http.get<IStory[]>(this.appConfig.apiEndpoint + this.storyUrl + '/backlog/'+backlogId)
          .pipe(catchError(this._appConfigService.handleError));
    }

    updateStatus(story:IStory):Observable<IStory>{
      return this.http.put<IStory>(this.appConfig.apiEndpoint + this.storyUrl + '/updateStatus', story)
      .pipe(catchError(this._appConfigService.handleError));
    }

    updateSprintAndBacklog(story:IStory):Observable<IStory>{
      return this.http.put<IStory>(this.appConfig.apiEndpoint + this.storyUrl + '/update/sprintAndBacklog', story)
      .pipe(catchError(this._appConfigService.handleError));
    }

}

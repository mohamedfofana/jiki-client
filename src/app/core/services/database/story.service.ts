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

    /*
     * Return stories on project backlogs
     */
    getStoriesOnBacklogsByProjectId(projectId:number): Observable<IStory[]> {
      return this.http.get<IStory[]>(this.appConfig.apiEndpoint + this.storyUrl + '/backlogs/project/'+projectId)
          .pipe(catchError(this._appConfigService.handleError));
    }

    /*
     * Find stories by sprint
    */
    getStoriesBySprint(sprintId:number): Observable<IStory[]> {
      return this.http.get<IStory[]>(this.appConfig.apiEndpoint + this.storyUrl + '/sprint/'+sprintId)
          .pipe(catchError(this._appConfigService.handleError));
    }

    /*
     * Update story status
     */
    updateStatus(story:IStory):Observable<IStory>{
      return this.http.put<IStory>(this.appConfig.apiEndpoint + this.storyUrl + '/updateStatus', story)
      .pipe(catchError(this._appConfigService.handleError));
    }

    /*
     * Update story backlog or sprint
     */
    updateSprintAndBacklog(story:IStory):Observable<IStory>{
      return this.http.put<IStory>(this.appConfig.apiEndpoint + this.storyUrl + '/update/sprintAndBacklog', story)
      .pipe(catchError(this._appConfigService.handleError));
    }

}

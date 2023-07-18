import { IStory } from '../../../shared/model/story.model';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AppConfigService } from '../../config/appconfig-service';

@Injectable({
  providedIn: 'root',
})
export class StoryService {
    private storyUrl:string = "/story"
    constructor(private http: HttpClient,
      private _appConfigService: AppConfigService) { }

    /*
     * Return stories on project backlogs
     */
    getStoriesOnBacklogsByProjectId(projectId:number): Observable<IStory[]> {
      return this.http.get<IStory[]>(this._appConfigService.apiConfig().apiEndpoint + this.storyUrl + '/backlogs/project/'+projectId)
          .pipe(catchError(this._appConfigService.handleError));
    }

    /*
     * Find stories by id
    */
     getStoryById(storyId:number): Observable<IStory> {
      return this.http.get<IStory>(this._appConfigService.apiConfig().apiEndpoint + this.storyUrl + '/'+storyId)
          .pipe(catchError(this._appConfigService.handleError));
    }
    /*
     * Find stories by sprint
    */
    getStoriesBySprint(sprintId:number): Observable<IStory[]> {
      return this.http.get<IStory[]>(this._appConfigService.apiConfig().apiEndpoint + this.storyUrl + '/sprint/'+sprintId)
          .pipe(catchError(this._appConfigService.handleError));
    }

    /*
     * Update story status
     */
    updateStatus(story:IStory):Observable<IStory>{
      return this.http.put<IStory>(this._appConfigService.apiConfig().apiEndpoint + this.storyUrl + '/updateStatus', story)
      .pipe(catchError(this._appConfigService.handleError));
    }

    /*
     * Update story backlog or sprint
     */
    updateSprintAndBacklog(story:IStory):Observable<IStory>{
      return this.http.put<IStory>(this._appConfigService.apiConfig().apiEndpoint + this.storyUrl + '/update/sprintAndBacklog', story)
      .pipe(catchError(this._appConfigService.handleError));
    }

}

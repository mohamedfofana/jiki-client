import { IStory } from '../../../shared/model/story.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, map } from 'rxjs';

import { AppConfigService } from '../../config/appconfig-service';
import { IResponseType } from 'src/app/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class StoryService {
    private storyUrl:string = "/story"
    constructor(private http: HttpClient,
    private _appConfigService: AppConfigService) { }

    create(story: IStory): Observable <IResponseType<IStory>> {
      story.creationDate = this._appConfigService.currentTimestamp();
      story.updateDate = this._appConfigService.currentTimestamp();
      
      return this.http.post<IResponseType<IStory>>(this._appConfigService.apiConfig().apiEndpoint + this.storyUrl + '/create', story)
      .pipe(
        map(response => {
            return response;
        })
      );
    }
    /*
     * Return stories on project backlogs
     */
    findOnBacklogsByProjectId(projectId:number): Observable<IStory[]> {
      return this.http.get<IStory[]>(this._appConfigService.apiConfig().apiEndpoint + this.storyUrl + '/backlogs/project/'+projectId);
    }

    /*
     * Find stories by id
    */
     findById(storyId:number): Observable<IStory> {
      return this.http.get<IStory>(this._appConfigService.apiConfig().apiEndpoint + this.storyUrl + '/'+storyId);
    }
    /*
     * Find stories by sprint
    */
    findBySprint(sprintId:number): Observable<IStory[]> {
      return this.http.get<IStory[]>(this._appConfigService.apiConfig().apiEndpoint + this.storyUrl + '/sprint/'+sprintId);
    }

    /*
     * Find stories by project
    */
    findByProject(projectId: number): Observable<IStory[]> {
      return this.http.get<IStory[]>(this._appConfigService.apiConfig().apiEndpoint + this.storyUrl + '/project/'+projectId);
    }
    

    /*
     * Update story status
     */
    updateStatus(story:IStory):Observable<IStory>{
      return this.http.put<IStory>(this._appConfigService.apiConfig().apiEndpoint + this.storyUrl + '/updateStatus', story);
    }

    /*
     * Update story backlog or sprint
     */
    updateSprintAndBacklog(story:IStory):Observable<IStory>{
      return this.http.put<IStory>(this._appConfigService.apiConfig().apiEndpoint + this.storyUrl + '/update/sprintAndBacklog', story);
    }

    /*
     * Path story
     */
    patch(id: number, fieldValueMap: Map<string, Object>){
      return this.http.patch(this._appConfigService.apiConfig().apiEndpoint + this.storyUrl + '/' + id, Object.fromEntries(fieldValueMap));
    }

}

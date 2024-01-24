import { IStory } from '../../../shared/model/story.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, map } from 'rxjs';
import { IResponseType } from 'src/app/shared/interfaces';
import { DateService } from '../local/date.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StoryService {
    private storyUrl:string = "/story"
    constructor(private http: HttpClient,
    private _dateService: DateService) { }

    create(story: IStory): Observable <IResponseType<IStory>> {
      story.creationDate = this._dateService.currentTimestamp();
      story.updateDate = this._dateService.currentTimestamp();
      
      return this.http.post<IResponseType<IStory>>('http://localhost:8181/api' + this.storyUrl + '/create', story)
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
      return this.http.get<IStory[]>('http://localhost:8181/api' + this.storyUrl + '/backlogs/project/'+projectId);
    }

    /*
     * Return stories on project backlogs
     */
    findByReporter(reporterId:number): Observable<IStory[]> {
      return this.http.get<IStory[]>('http://localhost:8181/api' + this.storyUrl + '/reporter/'+reporterId);
    }

    /*
     * Find stories by id
    */
     findById(storyId:number): Observable<IStory> {
      return this.http.get<IStory>('http://localhost:8181/api' + this.storyUrl + '/'+storyId);
    }
    /*
     * Find stories by sprint
    */
    findBySprint(sprintId:number): Observable<IStory[]> {
      return this.http.get<IStory[]>('http://localhost:8181/api' + this.storyUrl + '/sprint/'+sprintId);
    }

    /*
     * Find stories by project
    */
    findByProject(projectId: number): Observable<IStory[]> {
      return this.http.get<IStory[]>('http://localhost:8181/api' + this.storyUrl + '/project/'+projectId);
    }
    

    /*
     * Update story status
     */
    updateStatus(story:IStory):Observable<IStory>{
      return this.http.put<IStory>('http://localhost:8181/api' + this.storyUrl + '/updateStatus', story);
    }

    moveToBacklog(backlogId: number, stories:IStory[]): Observable<IResponseType<boolean>> {
      return this.http.put<IResponseType<boolean>>('http://localhost:8181/api' + this.storyUrl + '/moveToBacklog/' + backlogId, stories);
    }

    moveToSprint(sprintId: number, stories:IStory[]): Observable<IResponseType<boolean>> {
      return this.http.put<IResponseType<boolean>>('http://localhost:8181/api' + this.storyUrl + '/moveToSprint/' + sprintId, stories);
    }

    /*
     * Update story backlog or sprint
     */
    updateSprintAndBacklog(story:IStory):Observable<IStory>{
      return this.http.put<IStory>('http://localhost:8181/api' + this.storyUrl + '/update/sprintAndBacklog', story);
    }

    /*
     * Path story
     */
    patch(id: number, fieldValueMap: Map<string, Object>){
      return this.http.patch('http://localhost:8181/api' + this.storyUrl + '/' + id, Object.fromEntries(fieldValueMap));
    }

}

import { SprintService } from './../../../core/services/database/sprint.service';
import { Subscription } from 'rxjs';
import { IBacklog } from './../../../shared/model/backlog-model';
import { IProject } from './../../../shared/model/project-model';
import { ProjectService } from './../../../core/services/database/project.service';
import { ISprint } from './../../../shared/model/sprint-model';
import { SprintStatusEnum } from './../../../shared/enum/sprint-status.enum';
import { moveItemInArray, transferArrayItem, CdkDragDrop } from '@angular/cdk/drag-drop';
import { LoggerService } from './../../../core/services/utils/logger.service';
import { StorageService } from './../../../core/services/local/storage.service';
import { StoryService } from './../../../core/services/database/story.service';
import { IStory } from './../../../shared/model/story-model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractOnDestroy } from '../../abstract.ondestroy';

@Component({
  selector: 'app-backlogs',
  templateUrl: './backlogs.component.html',
  styleUrls: ['./backlogs.component.css']
})
export class BacklogsComponent extends AbstractOnDestroy implements OnInit {
    inProgressSprintStories: IStory[];
    165: IStory[];
    sprint:ISprint;
    projectId:number;
    backlogId:number;
    backlog:IBacklog;

    constructor(private _storyService: StoryService,
       private _sprintService: SprintService,
      private _storageService: StorageService,
      private _loggerService: LoggerService,
      private _projectService: ProjectService
      ) {
        super();
      }

      ngOnInit() {
      this.projectId = this._storageService.getUser().project.id;
      // this.backlogId = this._storageService.getUser().project.backlog.id;
      let subscriptionSprint = this._sprintService.getCurrentSprintByProjectId(this.projectId)
    .subscribe((sprint: ISprint) => {
      if(sprint){
        this.sprint = sprint;
        console.log(this.sprint.id);
        console.log(this.projectId);
        let subscription = this._storyService.getStoriesBySprint( this.sprint.id)
      .subscribe((stories: IStory[]) => {
        if(stories){
          console.log(stories);
          this.inProgressSprintStories = stories;
          this.setBacklog();
        }
      /*  let subscriptionBacklog = this._storyService.getStoriesByBacklog(this.backlogId)
        .subscribe((stories: IStory[]) => {
          if(stories){
            this.backlogStories = stories;
            this.setBacklog();
          }
        });
        this.subscriptions.push(subscriptionBacklog);
        */
      });
      this.subscriptions.push(subscription);
      }
    });
    this.subscriptions.push(subscriptionSprint);
    }

     drop(event: CdkDragDrop<IStory[]>) {
      if (event.previousContainer === event.container) {
        this._loggerService.log("no dropping");
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        this._loggerService.log("dropping");
        this._loggerService.log(event.previousContainer);
        this._loggerService.log(event.container);
        let story = <IStory> event.previousContainer.data[event.previousIndex];
        let listName = event.container.id;
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);

          this.updateStory(story, listName);

        }
      }

      setBacklog(){
        let subscription = this._projectService.getProjectById(this.projectId)
        .subscribe((project: IProject) => {
          this.backlog = project.backlog;
        });
        this.subscriptions.push(subscription);
      }

      updateStory(story:IStory, listName: string){
        if (listName.match("cdk-drop-list-0")){
          story.backlog = null;
          story.sprint = this.sprint;
        }
        if (listName.match("cdk-drop-list-1")){
          story.backlog = this.backlog;
          story.sprint = null;
        }
        this._loggerService.log(story);
        this.updateSprintAndBacklog(story);
      }

      updateSprintAndBacklog(story:IStory){
        let subscription = this._storyService.updateSprintAndBacklog(story).subscribe(
          response =>{
            this._loggerService.log("updated : "  +response);
          }
          );
          this.subscriptions.push(subscription);
        }
      }

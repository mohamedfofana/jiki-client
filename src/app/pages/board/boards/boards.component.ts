import { SprintService } from './../../../core/services/database/sprint.service';
import { ISprint } from '../../../shared/model/sprint.model';
import { UserService } from './../../../core/services/database/user.service';
import { FormControl } from '@angular/forms';
import { IUser } from '../../../shared/model/user.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { StoryStatusEnum } from './../../../shared/enum/story-status.enum';
import { StorageService } from './../../../core/services/local/storage.service';
import { IStory } from '../../../shared/model/story.model';
import { StoryService } from './../../../core/services/database/story.service';
import { Component, OnInit } from '@angular/core';
import { AbstractOnDestroy } from '../../../core/services/abstract.ondestroy';
import { IProject } from 'src/app/shared/model/project.model';
import { filter, map, mergeMap } from 'rxjs';
import { TeamService } from 'src/app/core/services/database/team.service';
import { ITeam } from 'src/app/shared/model/team.model';
import { ProjectService } from 'src/app/core/services/database/project.service';
import { AuthService } from 'src/app/core/services/database/auth.service';

@Component({
  selector: 'jiki-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css']
})
export class BoardsComponent extends AbstractOnDestroy implements OnInit {
  boardTitle: string;
  currentUser: IUser = this._storageService.getUser();
  currentSprint: ISprint;
  currentProject: IProject;
  projects: IProject[]=[];
  stories: IStory[];
  todoStories: IStory[];
  inProgressStories: IStory[];
  doneStories: IStory[];
  blockedStories: IStory[];

  selectedAssignee:IUser[]=[];
  selectedReporter:IUser[]=[];

  selectReporterFormControl =  new FormControl<IUser[]>([]);
  selectAssigneeFormControl = new FormControl<IUser[]>([]);

  assigneeList: IUser[];
  reporterList: IUser[];
  constructor(private _storyService: StoryService,
              private _sprintService: SprintService,
              private _authservice: AuthService,
              private _storageService: StorageService,
              private _userService: UserService) {
      super();
    }

  ngOnInit() {
    this.boardTitle ='Board';
    if(!this._authservice.isUserAdmin()){
      this.currentProject = this._storageService.getProject();
      this.projects.push(this.currentProject);
      const subscriptionSprint$ = this._sprintService.findCurrentByProjectId(this.currentProject.id)
                .pipe(                  
                  filter(sprint => {
                    if(sprint)
                     return true;
                    else
                     return false;
                    }
                  ),
                  map((sprint: ISprint) => {
                    this.currentSprint = sprint;
                    this.boardTitle = sprint.project.name + ' - ' + sprint.title;
                    return sprint;
                  }),
                  mergeMap(sprint => {                    
                    return this._storyService.findBySprint(sprint.id);
                  }),
                  filter(stories => {
                    if(stories)
                     return true;
                    else
                     return false;
                    }
                  ),
                  map((stories: IStory[]) => { 
                    this.stories = stories;
                    if(stories){
                      this.setStoriesByStatus(stories);
                    }
                    }
                  ),
                  mergeMap(() => 
                    this._userService.findByTeam(this._storageService.getUser().team.id)
                  )
                ).subscribe((users: IUser[]) => {
                  if(users){
                    this.assigneeList = users.sort((s1, s2)=> s1.lastname>s2.lastname? -1:1);
                    this.reporterList = this.assigneeList;
                  }
                });
      this.subscriptions.push(subscriptionSprint$);
    }    
  }

  setStoriesByStatus(stories:IStory[]){
      this.todoStories = stories.filter(s => s.status.match(StoryStatusEnum.TODO));
      this.inProgressStories = stories.filter(s => s.status.match(StoryStatusEnum.IN_PROGRESS));
      this.doneStories = stories.filter(s => s.status.match(StoryStatusEnum.DONE));
      this.blockedStories = stories.filter(s => s.status.match(StoryStatusEnum.BLOCKED));
  }

   drop(event: CdkDragDrop<IStory[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      let story = <IStory> event.previousContainer.data[event.previousIndex];
      let newStatus = this.getStatus(event.container.id);
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
      this.updateStory(story, newStatus);

    }
  }
  updateStory(story:IStory, newStatus: string){
      story.status = newStatus;
      this._storyService.updateStatus(story).subscribe(
        response =>{
          //this._loggerService.log("updated : "  +response);
        }
      );
  }

  filterUserChanged(event: any) {
    let currentStories =this.stories;
    let stories = this.getFilterAssignees(currentStories);
    currentStories = this.getFilterReporters(stories);
    this.setStoriesByStatus(currentStories);
  }

  getFilterReporters(currentStories: IStory[]): IStory[]{
    let filterReporter = this.selectReporterFormControl.value as IUser[];
    if(filterReporter && filterReporter.length>0){
      currentStories = this.stories.filter(s=>
        {
        let found = false;
          filterReporter.forEach(ass =>{
            if (s && s.reporter && s.reporter.id === ass.id){
                found = true;
                return;
            }
          })
          return found;
        });
      }
      return currentStories;
  }

  getFilterAssignees(currentStories: IStory[]): IStory[]{
    let filterAssignee = this.selectAssigneeFormControl.value as IUser[];
    if(filterAssignee && filterAssignee.length>0){
      currentStories = this.stories.filter(s=>
        {
        let found = false;
          filterAssignee.forEach(ass =>{
            if (s && s.assignedUser && s.assignedUser.id === ass.id){
                found = true;
                return;
            }
          })
          return found;
        });
      }
      return currentStories;
  }

  onReporterRemoved(reporter: IUser) {
    const reporters = this.selectReporterFormControl.value as IUser[];
    let filterReporter = reporters.filter(r => r.id != reporter.id);
    this.selectReporterFormControl.setValue(filterReporter);
    this.filterUserChanged(null);
  }

  onAssigneeRemoved(assignee: IUser) {
    const assignees = this.selectAssigneeFormControl.value as IUser[];
    let filterAssignee = assignees.filter(r => r.id != assignee.id);
    this.selectAssigneeFormControl.setValue(filterAssignee);
    this.filterUserChanged(null);
  }

  getStatus(listName: string):string{
   return this.getStoryStatusEnum(listName);
  }

  getStoryStatusEnum(listName: string): string {
    if (listName.match("cdk-drop-list-0")){
      return StoryStatusEnum.TODO;
    }
    if (listName.match("cdk-drop-list-1")){
      return StoryStatusEnum.IN_PROGRESS;
    }
    if (listName.match("cdk-drop-list-2")){
      return StoryStatusEnum.DONE;
    }
    if (listName.match("cdk-drop-list-3")){
      return StoryStatusEnum.BLOCKED;
    }
    return StoryStatusEnum.TODO;
  }
}

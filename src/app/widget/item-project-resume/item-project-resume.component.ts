import { IUser } from '../../shared/model/user.model';
import { StoryService } from '../../core/services/database/story.service';
import { IStory } from '../../shared/model/story.model';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractOnDestroy } from 'src/app/core/services/abstract.ondestroy';
import { IProject } from 'src/app/shared/model/project.model';

import { MatLegacyMenuTrigger as MatMenuTrigger } from '@angular/material/legacy-menu';
import { ISprint } from 'src/app/shared/model/sprint.model';
import { BacklogService } from 'src/app/core/services/database/backlog.service';
import { IBacklog } from 'src/app/shared/model/backlog.model';
import { BehaviorSubject, Observable, filter, forkJoin, map, of, switchMap } from 'rxjs';
import { NotifierService } from 'src/app/core/services/notification/notifier.service';

@Component({
  selector: 'jiki-item-project-resume',
  templateUrl: './item-project-resume.component.html',
  styleUrls: ['./item-project-resume.component.css']
})
export class ItemProjectResumeComponent extends AbstractOnDestroy implements OnInit, OnChanges {
  panelOpenState = true;
  @Input() isBacklog: boolean;
  @Input() filterText: string;
  @Input() filterAssignee: IUser[];
  @Input() filterReporter: IUser[];
  @Input() filterStatus: string[];
  @Input() project: IProject;
  @Input() projects: IProject[];
  @Input() currentSprint : ISprint;
  stories$: Observable<IStory[]>;
  filteredStories$: Observable<IStory[]>;
  sprints: ISprint[];
  backlogs: IBacklog[];
  filteredStories: IStory[];
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(private _storyService: StoryService,
              private _backlogService: BacklogService,
              private _notifierService: NotifierService) {
    super();
  }

  ngOnInit(): void {    
    if(this.currentSprint){
      this.stories$ = this.filteredStories$ = this._notifierService.storiesNotifier().pipe(
                                                                                           switchMap( _ => this.initStories())
                                                                                          );
      //this.initStories();
      this.initBackog();
    }
  }
initBackog(){
  let subscriptionBacklogs = this._backlogService.getBacklogs()
      .subscribe((backlogs: IBacklog[]) => {
        if (backlogs) {
          this.backlogs = backlogs;
        }
      });
    this.subscriptions.push(subscriptionBacklogs);
}
  initStories(){
   return this._storyService.getStoriesOnBacklogsByProjectId(this.project.id);    
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onChange();
  }
  onChange() {
    let currentStories$ = this.stories$;
    if (this.filterText && this.filterText.trim().length>0) {
      currentStories$ = this.getChangeText(currentStories$);
    }

    if (this.filterAssignee && this.filterAssignee.length>0) {
      currentStories$ = this.getChangeAssignee(currentStories$);
    }

    if (this.filterReporter && this.filterReporter.length>0) {
      currentStories$ = this.getChangeReporter(currentStories$);
    }

    if (this.filterStatus && this.filterStatus.length>0) {
      currentStories$ = this.getChangeStatus(currentStories$);
    }

    if (currentStories$) {
      this.filteredStories$ = currentStories$;
    } else {
      this.filteredStories$ = this.stories$;
    }
  }

  getChangeText(currentStories$:Observable<IStory[]>):Observable<IStory[]> {
    let changed$ =  currentStories$.pipe(
                          map(stories => {
                            return stories.filter(s => new String(s.title).includes(this.filterText))
                          })
                        ); 


    return changed$;
  }

  getChangeReporter(currentStories$:Observable<IStory[]> ):Observable<IStory[]>  {
    let filtered$ =  currentStories$.pipe(
                                        map(stories => {
                                          return stories.filter(s => {                              
                                            return this.memberOfReporter(s);
                                          }  
                                        )})
    ); 
    return filtered$;
  }

  getChangeAssignee(currentStories$:Observable<IStory[]> ):Observable<IStory[]>  {
    let filtered$ =  currentStories$.pipe(
                                        map(stories => {
                                          return stories.filter(s => {                              
                                            return this.memberOfAssignee(s);
                                          }  
                                        )})
    ); 
    return filtered$;
  }

  getChangeStatus(currentStories$:Observable<IStory[]> ):Observable<IStory[]>  {
    let statuses = new String(this.filterStatus);
    let status:string[]=[];
    status = statuses.split(",");
    let filtered$ =  currentStories$.pipe(
      map(stories => {       
        return stories.filter(s => {    
          const found = status.find( stat => s.status === stat)
          return (found)? true:false;                                    
        }  
      )})
    ); 
  return filtered$;

  }

  memberOfAssignee(story: IStory): boolean{
    if (story.assignedUser){
      if (story.assignedUser.id){
        const found = this.filterAssignee.find( a => story.assignedUser.id === a.id)
        return (found)? true:false;
      }
    }
    return false;
  }

  memberOfReporter(story: IStory): boolean{
    if (story.reporter){
      if (story.reporter.id){
        const found = this.filterReporter.find( a => story.reporter.id === a.id)
        return (found)? true:false;
      }
    }
    return false;
  }

  onContextMenu(event: MouseEvent, story: IStory) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = story;
    this.contextMenu.openMenu();
  }

  moveToSprint() {
    let story =  this.contextMenu.menuData;
    story.project  = this.currentSprint.project;
    story.backlog = null;
    story.sprint = this.currentSprint;

    const subs = this._storyService.updateSprintAndBacklog(story).subscribe(s =>
             this._notifierService.notifyStories()
      );
    this.subscriptions.push(subs)

  }
  
  moveToBacklog(project: IProject) {
    let story =  this.contextMenu.menuData;
    story.project.id = project.id;
    story.backlog.id = project.backlog.id
    story.sprint = null;

    const subs = this._storyService.updateSprintAndBacklog(story).subscribe(s =>
      this._notifierService.notifyStories() 
    );
    this.subscriptions.push(subs)
 }
}

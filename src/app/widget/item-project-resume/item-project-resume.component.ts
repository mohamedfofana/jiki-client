import { IUser } from '../../shared/model/user.model';
import { StoryService } from '../../core/services/database/story.service';
import { IStory } from '../../shared/model/story.model';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractOnDestroy } from 'src/app/core/services/abstract.ondestroy';
import { IProject } from 'src/app/shared/model/project.model';

import { MatMenuTrigger } from '@angular/material/menu';
import { ISprint } from 'src/app/shared/model/sprint.model';
import { IBacklog } from 'src/app/shared/model/backlog.model';
import { Observable, map, of, switchMap } from 'rxjs';
import { NotifierService } from 'src/app/core/services/notification/notifier.service';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';
import { SprintStartDialogComponent } from 'src/app/pages/sprint/sprint-start-dialog/sprint-start-dialog.component';
import { SprintStatusEnum } from 'src/app/shared/enum/sprint-status.enum';
import { SprintStatusConstant } from 'src/app/shared/constants/sprint-status.constant';

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
  sprintTitle: string = 'Sprint';
  notStarted: boolean = false;
  statuses = SprintStatusConstant;

  constructor(private _storyService: StoryService,
    private _dialogService: DialogService,
              private _notifierService: NotifierService) {
    super();
  }

  ngOnInit(): void {
    this.stories$ = this.filteredStories$ = this._notifierService.storiesNotifier().pipe(
      switchMap( _ => this.initStories())
    );    
    if (!this.isBacklog && this.currentSprint) {
      this.notStarted = (this.currentSprint.status === SprintStatusEnum.CREATED); 
      this.sprintTitle += ' ' + this.currentSprint.id; 
    }
  }

  initStories(){
    if(this.isBacklog){
      return this._storyService.findOnBacklogsByProjectId(this.project.id);    
    }else{
      if(this.currentSprint){
        return this._storyService.findBySprint(this.currentSprint.id);          
      }
    }
    return of<IStory[]>([]);
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
    //if((this.isBacklog && this.currentSprint) || (this.isBacklog)){
      this.contextMenuPosition.x = event.clientX + 'px';
      this.contextMenuPosition.y = event.clientY + 'px';
      this.contextMenu.menuData = story;
      this.contextMenu.menu?.focusFirstItem('mouse');
      this.contextMenu.openMenu();
    //}
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

  moveToBacklog() {
    let story =  this.contextMenu.menuData;
    story.project = this.project;
    story.backlog = this.project.backlog;
    story.sprint = null;

    const subs = this._storyService.updateSprintAndBacklog(story).subscribe(s =>
      this._notifierService.notifyStories() 
    );
    this.subscriptions.push(subs)
 }

 startSprint(): void {
  this.stories$.subscribe((stories: IStory[]) => {
    console.log(stories);
    if(!stories || stories.length == 0) {
      this._dialogService.showPopupError('You cannot start a sprint without story.')
    }else {
      this._dialogService.showPopupComponent(this.currentSprint, SprintStartDialogComponent);
    }
  });
}
}

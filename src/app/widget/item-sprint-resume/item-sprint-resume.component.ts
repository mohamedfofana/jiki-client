import { IUser } from '../../shared/model/user.model';


import { StoryService } from './../../core/services/database/story.service';
import { IStory } from '../../shared/model/story.model';
import { ISprint } from '../../shared/model/sprint.model';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AbstractOnDestroy } from 'src/app/core/services/abstract.ondestroy';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, map } from 'rxjs';
import { SprintStatusEnum } from 'src/app/shared/enum/sprint-status.enum';
import { SprintService } from 'src/app/core/services/database/sprint.service';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/core/services/dialog/dialog.service';


@Component({
  selector: 'jiki-item-sprint-resume',
  templateUrl: './item-sprint-resume.component.html',
  styleUrls: ['./item-sprint-resume.component.css']
})
export class ItemSprintResumeComponent extends AbstractOnDestroy implements OnInit, OnChanges {
  panelOpenState = true;
  @Input() filterText: string;
  @Input() filterAssignee: IUser[];
  @Input() filterReporter: IUser[];
  @Input() filterStatus: string[];
  @Input() sprint: ISprint;
  stories$: Observable<IStory[]>;
  filteredStories$: Observable<IStory[]>;
  notStarted: boolean = false;
  readonly MAX_SPRINT_BUSINESS_VALUE: number = 24; // 2*8 // 8 = 1 weeks 

  constructor(private _dialogService: DialogService,
              private _storyService: StoryService,
              private _sprintService: SprintService,              
              private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.stories$ = this.filteredStories$ = this._storyService.findBySprint(this.sprint.id); 
    this.notStarted = (this.sprint.status === SprintStatusEnum.CREATED); 

  }

  startSprint(): void {
    let theBusinessValue = 0; // all
    this.stories$.subscribe((stories: IStory[]) => {
      theBusinessValue = stories.reduce((s1, s2) => s1 + s2.businessValue, 0);
      if(theBusinessValue < this.MAX_SPRINT_BUSINESS_VALUE) {
        this._dialogService.showPopupError('You do not have engough business value on the sprint.')
      }else {
        this.sendStart(theBusinessValue);
      }
    });
  }

  sendStart(theBusinessValue: number){ 
    this.sprint.businessValue =  theBusinessValue;
    this._sprintService.start(this.sprint).subscribe(sprint => {
      if (sprint) {
        this.router.navigate(['/board']);
      }
    });
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
}

import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Editor } from 'ngx-editor';
import { Observable, mergeMap, map, Subscription } from 'rxjs';
import { AppConfigService } from 'src/app/core/config/appconfig-service';
import { StoryService } from 'src/app/core/services/database/story.service';
import { UserService } from 'src/app/core/services/database/user.service';
import { VersionService } from 'src/app/core/services/database/version.service';
import { StoryStatusEnum } from 'src/app/shared/enum/story-status.enum';
import { IStory } from 'src/app/shared/model/story.model';
import { IUser } from 'src/app/shared/model/user.model';
import { IVersion } from 'src/app/shared/model/version.model';
import { SelectUserViewPipe } from 'src/app/shared/pipes/select-user-view.pipe';
import { PrioritySet, regExps, StoryPointsSet } from 'src/app/shared/validators/custom.validators';

declare var $: any;
enum Fields  {
  appliVersion = "appliVersion",
  status = "status",
  title = "title",
  storyPoints = "storyPoints",
  priority = "priority",
  assigneeId = "assigneeId",
  description = "description"
}
@Component({
  selector: 'app-story-view-edit',
  templateUrl: './story-view-edit.component.html',
  styleUrls: ['./story-view-edit.component.css']
})
export class StoryViewEditComponent implements OnInit, OnDestroy {
  editor: Editor;
  // Editale 
  newStory: IStory;
  enumKeys = Object.keys;
  enumValues = Object.values;
  statuses = StoryStatusEnum;
  story: IStory;
  emptyUser:IUser;
  users$: Observable<IUser[]>;
  filteredAssignees$: Observable<IUser[]>;
  versions$: Observable<IVersion[]>;
  idStory: number;
  htmlContent = '';
  subscriptions: Subscription[]= [];
  storyTypeIcon: string;
  fieldMap= new Map<string, string>();


  constructor(private _route: ActivatedRoute,
              private _storyService: StoryService,
              private _userService: UserService,
              private _versionService: VersionService,
              private _selectUserViewPipe: SelectUserViewPipe,
              private _appConfigService: AppConfigService,
              public dialogConfirm: MatDialog,
              ) { }

   displayUserFn = (user: IUser) =>  {
    return user && this._selectUserViewPipe.transform(user);
   }

  ngOnInit(): void {
   const id:string = this._route.snapshot.paramMap.get("id") ?? '';
   this.idStory = parseInt(id);
   if(!Number.isNaN(this.idStory)){
  
    this._storyService.getStoryById(this.idStory)
          .pipe(
            map(
              story=>{               
                this.initStories(story);
              }
            ),
            mergeMap(() => 
            // TODO Change and get all the user on the team's project 
              this.users$ = this._userService.findByProject(this.story.project.id)
            ),
            map(
              () =>   
              this.filteredAssignees$ = this.users$
            ),
            mergeMap(() =>
                this.versions$ = this._versionService.findByProject(this.story.project.id)
            )
          ).subscribe(

          );
          
   }
   this.initFieldMap();
  }

  private initFieldMap() {
    this.fieldMap.set(Fields.appliVersion, "appli_version");
    this.fieldMap.set(Fields.status, "status");
    this.fieldMap.set(Fields.title, "title");
    this.fieldMap.set(Fields.storyPoints, "story_points");
    this.fieldMap.set(Fields.priority, "priority");
    this.fieldMap.set(Fields.assigneeId, "assigned_user_id");
    this.fieldMap.set(Fields.description, "description");
  }

  initStories(s: IStory){
    this.story = s;
    this.newStory =Object.assign({}, s);
    this.editor = new Editor();
    this.story.longtitle = this.story.project.name+"-"+this.story.id;
    this.story.iconType = this._appConfigService.getStoryTypeIcon(this.story.type);
    this.story.iconTypeColor = this._appConfigService.getStoryTypeIconColor(this.story.type);
  }

  public filterAssignee(value: string ) {
    this.filteredAssignees$ = this._filterUsers(value);
  }

  private _filterUsers(value: string): Observable<IUser[]>{
    let filtered$ = this.users$.pipe(
      map(users => 
        users.filter( user => this._selectUserViewPipe.transform(user).includes(value)                  
        )
      ));

    return filtered$;
  }

  assignToMe(){
    this.filteredAssignees$ = this.users$;  
    
    this.newStory.assignedUser = this.story.reporter;
    this.story.assignedUser = this.story.reporter;
    
    this.updateField('assigned_user_id', this.newStory.assignedUser.id);    

  }

  public resetAssignee(event: any){
    this.filteredAssignees$ = this.users$;
    this.newStory.assignedUser = this.emptyUser;
  }

  onAssigneeSelectionChange(){
    this.filteredAssignees$ = this.users$;
    if(this.newStory.assignedUser.id !== this.story.assignedUser.id){
      this.updateField(Fields.assigneeId, this.newStory.assignedUser.id);
      this.story.assignedUser = this.newStory.assignedUser;
    }
  }

  onSelectionChange(event: any){   
    const field = event.source.ngControl.name;

    if(field === Fields.appliVersion){ 
      if(this.newStory.appliVersion !== this.story.appliVersion){
        this.updateField(field, this.newStory.appliVersion);
      }
    }

    if(field === Fields.status){      
      if(this.newStory.status !== this.story.status){
        this.updateField(field, this.newStory.status);
      }
    }  
  }

  onLostFocus(event: any){
    const field = event.target.name;
    
    if(field === Fields.title){
      if(this.newStory.title !== this.story.title){
        this.updateField(field, this.newStory.title);
      }
    }
    if(field === Fields.storyPoints){    
      if(this.newStory.storyPoints !== this.story.storyPoints){
        const valid = StoryPointsSet.find( a => this.newStory.storyPoints == a);   
        if(!valid){       
          this.newStory.storyPoints = this.story.storyPoints;       
        }else{
          this.updateField(field, this.newStory.storyPoints);
        }  
      }
    }

    if(field === Fields.priority){
      if(this.newStory.priority !== this.story.priority){
        const valid = PrioritySet.find( a => this.newStory.priority == a);   
        if(!valid){       
          this.newStory.priority = this.story.priority;       
        }else{
          this.updateField(field, this.newStory.priority);
        }  
      }
    }

    if(field === Fields.assigneeId){
      this.filteredAssignees$ = this.users$;
      this.newStory.assignedUser = this.story.assignedUser;
    }
  }

  updateField(field: any, value: Object){
    let fieldValueMap = new Map<string, Object>();
    let updatedField: any = this.fieldMap.get(field);
    fieldValueMap.set(updatedField, value);

    let sub = this._storyService.patch(this.newStory.id, fieldValueMap)
                                .subscribe(() => {
                                    console.log('updated = ' + field);
                               });
   this.subscriptions.push(sub);

  }

  updateDescription(){
    if(this.newStory.description !== this.story.description){
      this.updateField(Fields.description, this.newStory.description);
      this.story.description = this.newStory.description
    }    
  }

  ngOnDestroy(): void {
    this.editor.destroy();
    this.subscriptions.forEach(x => {
      if(!x.closed) {
        x.unsubscribe();
      }
    });
  } 
}

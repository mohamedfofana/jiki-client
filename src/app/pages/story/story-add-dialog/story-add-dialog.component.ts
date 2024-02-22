import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, concatMap, map } from 'rxjs';
import { GrowlerMessageType, GrowlerService } from 'src/app/core/growler/growler.service';
import { AbstractOnDestroy } from 'src/app/core/services/abstract.ondestroy';
import { CategoryService } from 'src/app/core/services/database/category.service';
import { SprintService } from 'src/app/core/services/database/sprint.service';
import { StoryService } from 'src/app/core/services/database/story.service';
import { VersionService } from 'src/app/core/services/database/version.service';
import { StorageService } from 'src/app/core/services/local/storage.service';
import { StoryLinkConstant } from 'src/app/shared/constants/story-link.constant';
import { StoryPointsConstant } from 'src/app/shared/constants/story-points.constant';
import { StoryPriorityConstant } from 'src/app/shared/constants/story-priority.constant';
import { StoryScopeConstant } from 'src/app/shared/constants/story-scope.constant';
import { StoryStatusConstant } from 'src/app/shared/constants/story-status.constant';
import { StoryTypeConstant } from 'src/app/shared/constants/story-type.constant';
import { IResponseType } from 'src/app/shared/interfaces';
import { ICategory } from 'src/app/shared/model/category.model';
import { IProject } from 'src/app/shared/model/project.model';
import { ISprint } from 'src/app/shared/model/sprint.model';
import { IStory } from 'src/app/shared/model/story.model';
import { IUser } from 'src/app/shared/model/user.model';
import { IVersion } from 'src/app/shared/model/version.model';
import { MyErrorStateMatcher, errorMessages } from 'src/app/shared/validators/custom.validators';

@Component({
  selector: 'app-story-add-dialog',
  templateUrl: './story-add-dialog.component.html',
  styleUrls: ['./story-add-dialog.component.css']
})
export class StoryAddDialogComponent extends AbstractOnDestroy implements OnInit {
  storyForm: FormGroup;
  titleFormControl: FormControl<string | null> =  new FormControl('', [Validators.required]);
  typeFormControl: FormControl<string | null> =  new FormControl('', [Validators.required]);
  businessValueFormControl: FormControl<string | null> =  new FormControl('', [Validators.required]);
  storyPointsFormControl: FormControl<string | null> =  new FormControl('', [Validators.required]);
  statusFormControl: FormControl<string | null> =  new FormControl('', [Validators.required]);
  priorityFormControl: FormControl<string | null> =  new FormControl('', [Validators.required]);
  sprintFormControl: FormControl<number | null> = new FormControl();
  scopeFormControl: FormControl<string | null> = new FormControl('', [Validators.required]);
  versionFormControl: FormControl<string | null> =  new FormControl('');
  linkTypeFormControl: FormControl<string | null> = new FormControl();
  linksFormControl: FormControl<number[] | null> = new FormControl();

  errors = errorMessages;
  formError:boolean;
  formErrorMessage:string;
  matcher = new MyErrorStateMatcher();
  newStory: IStory;
  statuses = StoryStatusConstant;
  storyTypes = StoryTypeConstant;
  linkTypes = StoryLinkConstant;
  storyPoints = StoryPointsConstant;
  priorities = StoryPriorityConstant;
  scopes = StoryScopeConstant;

  selectedStory:IStory[]=[];
  selectStoriesFormControl = new FormControl<IStory[]>([]);
  filterStories:IStory[];
  storiesList:IStory[];
  currentSprints: ISprint[];
  currentUser: IUser;
  currentProject: IProject;
  versions$: Observable<IVersion[]>;
  category$: Observable<ICategory[]>;

  constructor(private _router: Router,
              public _dialogRef: MatDialogRef<StoryAddDialogComponent>,
              private _storyService: StoryService,
              private _versionService: VersionService,
              private _categoryService: CategoryService,
              private _sprintService: SprintService,
              private _zone: NgZone,
              private _storageService: StorageService,
              private _formBuilder: FormBuilder,
              public dialogConfirm: MatDialog,
              private _growler: GrowlerService) { 
    super();
  }

  ngOnInit(){
    this.currentUser = this._storageService.getUser();
    this.currentProject = this._storageService.getProject();
    this.initForm();
    this.initDbControl();

  }

  initForm(){
    this.storyForm = this._formBuilder.group({
     title : this.titleFormControl,
     type : this.typeFormControl,
     businessValue : this.storyPointsFormControl,
     storyPoints : this.storyPointsFormControl,
     status : this.statusFormControl,
     scope : this.scopeFormControl,
     priority : this.priorityFormControl,
     version : this.versionFormControl,
     linkType : this.linkTypeFormControl,
     links : this.linksFormControl,
     sprint : this._formBuilder.group({
      id: this.sprintFormControl}),      
    });
  }

  initDbControl() {
    //TODO only not closed sprints
    const subscriptionSprint$ = this._sprintService.findByProjectId(this.currentProject.id)
      .pipe(
      map((sprints: ISprint[]) => { 
          if(sprints){
            this.currentSprints = sprints;
          }
        }
      ), concatMap(() =>
        this.versions$ = this._versionService.findByProject(this.currentProject.id)
      ),concatMap(() =>
        this.category$ = this._categoryService.findByProject(this.currentProject.id)
      ),     
      concatMap(()=> 
        this._storyService.findByProject(this.currentProject.id)
      )
    ).subscribe((stories: IStory[]) => {
      if(stories){
        this.storiesList = stories.sort((s1, s2)=> s1.title > s2.title? -1:1);
      }
    });

    this.subscriptions.push(subscriptionSprint$);
  }

  onSubmitClick(): void {
    this.setFormError(false, '');
    this.updateNewStoryProperties();
    const subscriptionUserAdd = this._storyService.create(this.newStory)
        .subscribe((response: IResponseType<IStory>) => {
              if(response.status === "OK"){
                this._growler.growl('Story created', GrowlerMessageType.Success);
                this._dialogRef.close();
                const url: string = '/stories/viewEdit/'+ response.entity.id;
                this._zone.run(() => this.gotoStoryViewEdit(url));
              }else{
                this.setFormError(true, "Unable to create story");
              }
        });
      this.subscriptions.push(subscriptionUserAdd);
  }

  private gotoStoryViewEdit(url: string): Promise<boolean> {
    return this._router.navigate([url]);
  }

  private updateNewStoryProperties() {
    this.newStory = this.storyForm.value;
    this.newStory.project = this.currentProject;
    this.newStory.reporter = this.currentUser;
    this.newStory.description = '';
    if (!this.newStory.sprint) {
      this.newStory.backlog = this.currentProject.backlog;
    }
  }

  setFormError(state:boolean, message: string){
    this.formError = state;
    this.formErrorMessage = message;
  }

  hasError(controlName: string, errorName: string) :boolean {
    return this.storyForm.controls[controlName].hasError(errorName);
  }

  filterStoryChanged(event: any) {
    this.filterStories = this.selectStoriesFormControl.value as IStory[];;
  }

  onStoryRemoved(story: IStory) {
    const storys = this.selectStoriesFormControl.value as IStory[];
    this.filterStories = storys.filter(r => r.id != story.id);
    this.selectStoriesFormControl.setValue(this.filterStories);
  }

}

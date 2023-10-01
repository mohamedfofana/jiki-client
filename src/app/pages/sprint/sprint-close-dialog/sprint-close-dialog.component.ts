import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map, mergeMap } from 'rxjs';
import { GrowlerMessageType, GrowlerService } from 'src/app/core/growler/growler.service';
import { AbstractOnDestroy } from 'src/app/core/services/abstract.ondestroy';
import { SprintService } from 'src/app/core/services/database/sprint.service';
import { StoryService } from 'src/app/core/services/database/story.service';
import { DateService } from 'src/app/core/services/local/date.service';
import { StorageService } from 'src/app/core/services/local/storage.service';
import { SprintStatusEnum } from 'src/app/shared/enum/sprint-status.enum';
import { StoryStatusEnum } from 'src/app/shared/enum/story-status.enum';
import { IResponseType } from 'src/app/shared/interfaces';
import { IDialogFormData } from 'src/app/shared/model/dialogForm-data.model';
import { ISprint } from 'src/app/shared/model/sprint.model';
import { IStory } from 'src/app/shared/model/story.model';
import { MyErrorStateMatcher, errorMessages } from 'src/app/shared/validators/custom.validators';

@Component({
  selector: 'jiki-sprint-close-dialog',
  templateUrl: './sprint-close-dialog.component.html',
  styleUrls: ['./sprint-close-dialog.component.css']
})
export class SprintCloseDialogComponent extends AbstractOnDestroy implements OnInit {
  sprintForm: FormGroup;
  sprintFormControl = new FormControl('', [Validators.required]);

  errors = errorMessages;
  formError:boolean;
  formErrorMessage:string;
  matcher = new MyErrorStateMatcher();
  newSprint: ISprint;
  sprints: ISprint[];
  stories: IStory[];
  doneStoriesCount: number = 0;
  remainingStoriesCount: number = 0;
  infoMessage: string = 'You can create a new sprint if you want to move in the remaining stories.';
  readonly CODE_BACKLOG = '0';
  remainingStories: IStory[];
  sprint: ISprint;
  emptySprint: ISprint;

  constructor(  public dialogRef: MatDialogRef<SprintCloseDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public dialogFormData: IDialogFormData<ISprint>,
                private _formBuilder: FormBuilder,
                private _sprintService: SprintService,
                private _storyService: StoryService,
                private _router: Router,
                private _dateService: DateService,
                private _storageService: StorageService,
                private _growler: GrowlerService) {
    super();
  }

  ngOnInit(){
    this.initSprintsAvailable();
    this.initForm();
  }

  private initSprintsAvailable() {
    this.sprint = this.dialogFormData.entity ? this.dialogFormData.entity : this.emptySprint;
    let subscriptions = this._sprintService.findByStatusInProject(this._storageService.getProject().id, SprintStatusEnum.CREATED)
      .pipe(
        map((sprints: ISprint[]) => {
          if (sprints && sprints.length > 0) {
            this.sprints = sprints;
          }
        }),
        mergeMap(() =>
          this._storyService.findBySprint(this.sprint.id)
        ),
        map((stories: IStory[]) => { 
          this.stories = stories;
          if(stories){
            this.remainingStories = stories.filter(s => s.status !== StoryStatusEnum.DONE);
            this.remainingStoriesCount = this.remainingStories.length;
            this.doneStoriesCount = stories.length - this.remainingStoriesCount;            
          }
          if(this.remainingStoriesCount == 0){
            this.sprints = [];
          }
        })
      ).subscribe(() => {        
       // this.initForm();
      });

    this.subscriptions.push(subscriptions);
  }

  initForm(){
    this.sprintForm = this._formBuilder.group({
      sprint : this.sprintFormControl,
    });
  }

  onSubmitClick(): void {
    this.setFormError(false, '');
    this.newSprint = this.sprintForm.value;
    this.sprint.status = SprintStatusEnum.CLOSED;
    this.sprint.updateDate = this._dateService.currentTimestamp();
    this.sprint.endDate = this._dateService.currentTimestamp();

    let subscription = this._sprintService.close(this.sprint)
        .pipe(
          map((response) => {
            if(response.status !== "OK"){            
              this.setFormError(true, "Unable to create sprint");
            }
          }),
          mergeMap(() => {
            if (this.sprintFormControl.value === this.CODE_BACKLOG){ 
              return this._storyService.moveToBacklog(this._storageService.getProject().backlog.id, this.remainingStories);
            }else {
              const sprinId = parseInt(this.sprintFormControl.value!)
              return this._storyService.moveToSprint(sprinId, this.remainingStories);
            }
          })
        )  
        .subscribe((response: IResponseType<boolean>) => {
          if(response.status === "OK"){
            this._growler.growl('Sprint Closed', GrowlerMessageType.Success);
            this.dialogRef.close();
            this._router.navigate(['sprints']);
          }else{
            this.setFormError(true, "Unable to create sprint");
          }
        });
      this.subscriptions.push(subscription);   
  }

  setFormError(state:boolean, message: string){
    this.formError = state;
    this.formErrorMessage = message;
  }

  hasError(controlName: string, errorName: string) :boolean {
    return this.sprintForm.controls[controlName].hasError(errorName);
  }

}
